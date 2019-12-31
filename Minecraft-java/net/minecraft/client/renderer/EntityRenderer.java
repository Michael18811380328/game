package net.minecraft.client.renderer;

import com.google.gson.JsonSyntaxException;
import java.io.IOException;
import java.nio.FloatBuffer;
import java.util.List;
import java.util.Random;
import java.util.concurrent.Callable;
import net.minecraft.block.Block;
import net.minecraft.block.BlockBed;
import net.minecraft.block.material.Material;
import net.minecraft.block.state.IBlockState;
import net.minecraft.client.Minecraft;
import net.minecraft.client.entity.AbstractClientPlayer;
import net.minecraft.client.gui.MapItemRenderer;
import net.minecraft.client.gui.ScaledResolution;
import net.minecraft.client.multiplayer.WorldClient;
import net.minecraft.client.particle.EffectRenderer;
import net.minecraft.client.renderer.culling.ClippingHelperImpl;
import net.minecraft.client.renderer.culling.Frustrum;
import net.minecraft.client.renderer.texture.DynamicTexture;
import net.minecraft.client.renderer.texture.TextureMap;
import net.minecraft.client.resources.IResourceManager;
import net.minecraft.client.resources.IResourceManagerReloadListener;
import net.minecraft.client.shader.ShaderGroup;
import net.minecraft.client.shader.ShaderLinkHelper;
import net.minecraft.crash.CrashReport;
import net.minecraft.crash.CrashReportCategory;
import net.minecraft.enchantment.EnchantmentHelper;
import net.minecraft.entity.Entity;
import net.minecraft.entity.EntityLivingBase;
import net.minecraft.entity.boss.BossStatus;
import net.minecraft.entity.item.EntityItemFrame;
import net.minecraft.entity.monster.EntityCreeper;
import net.minecraft.entity.monster.EntityEnderman;
import net.minecraft.entity.monster.EntitySpider;
import net.minecraft.entity.passive.EntityAnimal;
import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.init.Blocks;
import net.minecraft.inventory.IInventory;
import net.minecraft.item.ItemStack;
import net.minecraft.potion.Potion;
import net.minecraft.util.AxisAlignedBB;
import net.minecraft.util.BlockPos;
import net.minecraft.util.EnumFacing;
import net.minecraft.util.EnumParticleTypes;
import net.minecraft.util.EnumWorldBlockLayer;
import net.minecraft.util.MathHelper;
import net.minecraft.util.MouseFilter;
import net.minecraft.util.MovingObjectPosition;
import net.minecraft.util.ReportedException;
import net.minecraft.util.ResourceLocation;
import net.minecraft.util.Vec3;
import net.minecraft.world.WorldSettings;
import net.minecraft.world.biome.BiomeGenBase;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.lwjgl.input.Mouse;
import org.lwjgl.opengl.Display;
import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GLContext;
import org.lwjgl.util.glu.Project;

public class EntityRenderer implements IResourceManagerReloadListener
{
    private static final Logger logger = LogManager.getLogger();
    private static final ResourceLocation locationRainPng = new ResourceLocation("textures/environment/rain.png");
    private static final ResourceLocation locationSnowPng = new ResourceLocation("textures/environment/snow.png");
    public static boolean anaglyphEnable;

    /** Anaglyph field (0=R, 1=GB) */
    public static int anaglyphField;

    /** A reference to the Minecraft object. */
    private Minecraft mc;
    private final IResourceManager resourceManager;
    private Random random = new Random();
    private float farPlaneDistance;
    public final ItemRenderer itemRenderer;
    private final MapItemRenderer theMapItemRenderer;

    /** Entity renderer update count */
    private int rendererUpdateCount;

    /** Pointed entity */
    private Entity pointedEntity;
    private MouseFilter mouseFilterXAxis = new MouseFilter();
    private MouseFilter mouseFilterYAxis = new MouseFilter();
    private float thirdPersonDistance = 4.0F;

    /** Third person distance temp */
    private float thirdPersonDistanceTemp = 4.0F;

    /** Smooth cam yaw */
    private float smoothCamYaw;

    /** Smooth cam pitch */
    private float smoothCamPitch;

    /** Smooth cam filter X */
    private float smoothCamFilterX;

    /** Smooth cam filter Y */
    private float smoothCamFilterY;

    /** Smooth cam partial ticks */
    private float smoothCamPartialTicks;

    /** FOV modifier hand */
    private float fovModifierHand;

    /** FOV modifier hand prev */
    private float fovModifierHandPrev;
    private float bossColorModifier;
    private float bossColorModifierPrev;

    /** Cloud fog mode */
    private boolean cloudFog;
    private boolean field_175074_C = true;
    private boolean field_175073_D = true;

    /** Previous frame time in milliseconds */
    private long prevFrameTime = Minecraft.getSystemTime();

    /** End time of last render (ns) */
    private long renderEndNanoTime;

    /**
     * The texture id of the blocklight/skylight texture used for lighting effects
     */
    private final DynamicTexture lightmapTexture;

    /**
     * Colors computed in updateLightmap() and loaded into the lightmap emptyTexture
     */
    private final int[] lightmapColors;
    private final ResourceLocation locationLightMap;

    /**
     * Is set, updateCameraAndRender() calls updateLightmap(); set by updateTorchFlicker()
     */
    private boolean lightmapUpdateNeeded;

    /** Torch flicker X */
    private float torchFlickerX;
    private float field_175075_L;

    /** Rain sound counter */
    private int rainSoundCounter;
    private float[] field_175076_N = new float[1024];
    private float[] field_175077_O = new float[1024];

    /** Fog color buffer */
    private FloatBuffer fogColorBuffer = GLAllocation.createDirectFloatBuffer(16);
    private float field_175080_Q;
    private float field_175082_R;
    private float field_175081_S;

    /** Fog color 2 */
    private float fogColor2;

    /** Fog color 1 */
    private float fogColor1;
    private int field_175079_V = 0;
    private boolean field_175078_W = false;
    private double cameraZoom = 1.0D;
    private double cameraYaw;
    private double cameraPitch;
    private ShaderGroup theShaderGroup;
    private static final ResourceLocation[] shaderResourceLocations = new ResourceLocation[] {new ResourceLocation("shaders/post/notch.json"), new ResourceLocation("shaders/post/fxaa.json"), new ResourceLocation("shaders/post/art.json"), new ResourceLocation("shaders/post/bumpy.json"), new ResourceLocation("shaders/post/blobs2.json"), new ResourceLocation("shaders/post/pencil.json"), new ResourceLocation("shaders/post/color_convolve.json"), new ResourceLocation("shaders/post/deconverge.json"), new ResourceLocation("shaders/post/flip.json"), new ResourceLocation("shaders/post/invert.json"), new ResourceLocation("shaders/post/ntsc.json"), new ResourceLocation("shaders/post/outline.json"), new ResourceLocation("shaders/post/phosphor.json"), new ResourceLocation("shaders/post/scan_pincushion.json"), new ResourceLocation("shaders/post/sobel.json"), new ResourceLocation("shaders/post/bits.json"), new ResourceLocation("shaders/post/desaturate.json"), new ResourceLocation("shaders/post/green.json"), new ResourceLocation("shaders/post/blur.json"), new ResourceLocation("shaders/post/wobble.json"), new ResourceLocation("shaders/post/blobs.json"), new ResourceLocation("shaders/post/antialias.json"), new ResourceLocation("shaders/post/creeper.json"), new ResourceLocation("shaders/post/spider.json")};
    public static final int shaderCount = shaderResourceLocations.length;
    private int shaderIndex;
    private boolean field_175083_ad;
    private int field_175084_ae;
    private static final String __OBFID = "CL_00000947";

    public EntityRenderer(Minecraft mcIn, IResourceManager p_i45076_2_)
    {
        this.shaderIndex = shaderCount;
        this.field_175083_ad = false;
        this.field_175084_ae = 0;
        this.mc = mcIn;
        this.resourceManager = p_i45076_2_;
        this.itemRenderer = mcIn.getItemRenderer();
        this.theMapItemRenderer = new MapItemRenderer(mcIn.getTextureManager());
        this.lightmapTexture = new DynamicTexture(16, 16);
        this.locationLightMap = mcIn.getTextureManager().getDynamicTextureLocation("lightMap", this.lightmapTexture);
        this.lightmapColors = this.lightmapTexture.getTextureData();
        this.theShaderGroup = null;

        for (int var3 = 0; var3 < 32; ++var3)
        {
            for (int var4 = 0; var4 < 32; ++var4)
            {
                float var5 = (float)(var4 - 16);
                float var6 = (float)(var3 - 16);
                float var7 = MathHelper.sqrt_float(var5 * var5 + var6 * var6);
                this.field_175076_N[var3 << 5 | var4] = -var6 / var7;
                this.field_175077_O[var3 << 5 | var4] = var5 / var7;
            }
        }
    }

    public boolean isShaderActive()
    {
        return OpenGlHelper.shadersSupported && this.theShaderGroup != null;
    }

    public void func_175071_c()
    {
        this.field_175083_ad = !this.field_175083_ad;
    }

    public void func_175066_a(Entity p_175066_1_)
    {
        if (OpenGlHelper.shadersSupported)
        {
            if (this.theShaderGroup != null)
            {
                this.theShaderGroup.deleteShaderGroup();
            }

            this.theShaderGroup = null;

            if (p_175066_1_ instanceof EntityCreeper)
            {
                this.func_175069_a(new ResourceLocation("shaders/post/creeper.json"));
            }
            else if (p_175066_1_ instanceof EntitySpider)
            {
                this.func_175069_a(new ResourceLocation("shaders/post/spider.json"));
            }
            else if (p_175066_1_ instanceof EntityEnderman)
            {
                this.func_175069_a(new ResourceLocation("shaders/post/invert.json"));
            }
        }
    }

    public void activateNextShader()
    {
        if (OpenGlHelper.shadersSupported)
        {
            if (this.mc.func_175606_aa() instanceof EntityPlayer)
            {
                if (this.theShaderGroup != null)
                {
                    this.theShaderGroup.deleteShaderGroup();
                }

                this.shaderIndex = (this.shaderIndex + 1) % (shaderResourceLocations.length + 1);

                if (this.shaderIndex != shaderCount)
                {
                    this.func_175069_a(shaderResourceLocations[this.shaderIndex]);
                }
                else
                {
                    this.theShaderGroup = null;
                }
            }
        }
    }

    private void func_175069_a(ResourceLocation p_175069_1_)
    {
        try
        {
            this.theShaderGroup = new ShaderGroup(this.mc.getTextureManager(), this.resourceManager, this.mc.getFramebuffer(), p_175069_1_);
            this.theShaderGroup.createBindFramebuffers(this.mc.displayWidth, this.mc.displayHeight);
            this.field_175083_ad = true;
        }
        catch (IOException var3)
        {
            logger.warn("Failed to load shader: " + p_175069_1_, var3);
            this.shaderIndex = shaderCount;
            this.field_175083_ad = false;
        }
        catch (JsonSyntaxException var4)
        {
            logger.warn("Failed to load shader: " + p_175069_1_, var4);
            this.shaderIndex = shaderCount;
            this.field_175083_ad = false;
        }
    }

    public void onResourceManagerReload(IResourceManager p_110549_1_)
    {
        if (this.theShaderGroup != null)
        {
            this.theShaderGroup.deleteShaderGroup();
        }

        this.theShaderGroup = null;

        if (this.shaderIndex != shaderCount)
        {
            this.func_175069_a(shaderResourceLocations[this.shaderIndex]);
        }
        else
        {
            this.func_175066_a(this.mc.func_175606_aa());
        }
    }

    /**
     * Updates the entity renderer
     */
    public void updateRenderer()
    {
        if (OpenGlHelper.shadersSupported && ShaderLinkHelper.getStaticShaderLinkHelper() == null)
        {
            ShaderLinkHelper.setNewStaticShaderLinkHelper();
        }

        this.updateFovModifierHand();
        this.updateTorchFlicker();
        this.fogColor2 = this.fogColor1;
        this.thirdPersonDistanceTemp = this.thirdPersonDistance;
        float var1;
        float var2;

        if (this.mc.gameSettings.smoothCamera)
        {
            var1 = this.mc.gameSettings.mouseSensitivity * 0.6F + 0.2F;
            var2 = var1 * var1 * var1 * 8.0F;
            this.smoothCamFilterX = this.mouseFilterXAxis.smooth(this.smoothCamYaw, 0.05F * var2);
            this.smoothCamFilterY = this.mouseFilterYAxis.smooth(this.smoothCamPitch, 0.05F * var2);
            this.smoothCamPartialTicks = 0.0F;
            this.smoothCamYaw = 0.0F;
            this.smoothCamPitch = 0.0F;
        }
        else
        {
            this.smoothCamFilterX = 0.0F;
            this.smoothCamFilterY = 0.0F;
            this.mouseFilterXAxis.func_180179_a();
            this.mouseFilterYAxis.func_180179_a();
        }

        if (this.mc.func_175606_aa() == null)
        {
            this.mc.func_175607_a(this.mc.thePlayer);
        }

        var1 = this.mc.theWorld.getLightBrightness(new BlockPos(this.mc.func_175606_aa()));
        var2 = (float)this.mc.gameSettings.renderDistanceChunks / 32.0F;
        float var3 = var1 * (1.0F - var2) + var2;
        this.fogColor1 += (var3 - this.fogColor1) * 0.1F;
        ++this.rendererUpdateCount;
        this.itemRenderer.updateEquippedItem();
        this.addRainParticles();
        this.bossColorModifierPrev = this.bossColorModifier;

        if (BossStatus.hasColorModifier)
        {
            this.bossColorModifier += 0.05F;

            if (this.bossColorModifier > 1.0F)
            {
                this.bossColorModifier = 1.0F;
            }

            BossStatus.hasColorModifier = false;
        }
        else if (this.bossColorModifier > 0.0F)
        {
            this.bossColorModifier -= 0.0125F;
        }
    }

    public ShaderGroup getShaderGroup()
    {
        return this.theShaderGroup;
    }

    public void updateShaderGroupSize(int p_147704_1_, int p_147704_2_)
    {
        if (OpenGlHelper.shadersSupported)
        {
            if (this.theShaderGroup != null)
            {
                this.theShaderGroup.createBindFramebuffers(p_147704_1_, p_147704_2_);
            }

            this.mc.renderGlobal.checkOcclusionQueryResult(p_147704_1_, p_147704_2_);
        }
    }

    /**
     * Finds what block or object the mouse is over at the specified partial tick time. Args: partialTickTime
     */
    public void getMouseOver(float p_78473_1_)
    {
        Entity var2 = this.mc.func_175606_aa();

        if (var2 != null)
        {
            if (this.mc.theWorld != null)
            {
                this.mc.mcProfiler.startSection("pick");
                this.mc.pointedEntity = null;
                double var3 = (double)this.mc.playerController.getBlockReachDistance();
                this.mc.objectMouseOver = var2.func_174822_a(var3, p_78473_1_);
                double var5 = var3;
                Vec3 var7 = var2.func_174824_e(p_78473_1_);

                if (this.mc.playerController.extendedReach())
                {
                    var3 = 6.0D;
                    var5 = 6.0D;
                }
                else
                {
                    if (var3 > 3.0D)
                    {
                        var5 = 3.0D;
                    }

                    var3 = var5;
                }

                if (this.mc.objectMouseOver != null)
                {
                    var5 = this.mc.objectMouseOver.hitVec.distanceTo(var7);
                }

                Vec3 var8 = var2.getLook(p_78473_1_);
                Vec3 var9 = var7.addVector(var8.xCoord * var3, var8.yCoord * var3, var8.zCoord * var3);
                this.pointedEntity = null;
                Vec3 var10 = null;
                float var11 = 1.0F;
                List var12 = this.mc.theWorld.getEntitiesWithinAABBExcludingEntity(var2, var2.getEntityBoundingBox().addCoord(var8.xCoord * var3, var8.yCoord * var3, var8.zCoord * var3).expand((double)var11, (double)var11, (double)var11));
                double var13 = var5;

                for (int var15 = 0; var15 < var12.size(); ++var15)
                {
                    Entity var16 = (Entity)var12.get(var15);

                    if (var16.canBeCollidedWith())
                    {
                        float var17 = var16.getCollisionBorderSize();
                        AxisAlignedBB var18 = var16.getEntityBoundingBox().expand((double)var17, (double)var17, (double)var17);
                        MovingObjectPosition var19 = var18.calculateIntercept(var7, var9);

                        if (var18.isVecInside(var7))
                        {
                            if (0.0D < var13 || var13 == 0.0D)
                            {
                                this.pointedEntity = var16;
                                var10 = var19 == null ? var7 : var19.hitVec;
                                var13 = 0.0D;
                            }
                        }
                        else if (var19 != null)
                        {
                            double var20 = var7.distanceTo(var19.hitVec);

                            if (var20 < var13 || var13 == 0.0D)
                            {
                                if (var16 == var2.ridingEntity)
                                {
                                    if (var13 == 0.0D)
                                    {
                                        this.pointedEntity = var16;
                                        var10 = var19.hitVec;
                                    }
                                }
                                else
                                {
                                    this.pointedEntity = var16;
                                    var10 = var19.hitVec;
                                    var13 = var20;
                                }
                            }
                        }
                    }
                }

                if (this.pointedEntity != null && (var13 < var5 || this.mc.objectMouseOver == null))
                {
                    this.mc.objectMouseOver = new MovingObjectPosition(this.pointedEntity, var10);

                    if (this.pointedEntity instanceof EntityLivingBase || this.pointedEntity instanceof EntityItemFrame)
                    {
                        this.mc.pointedEntity = this.pointedEntity;
                    }
                }

                this.mc.mcProfiler.endSection();
            }
        }
    }

    /**
     * Update FOV modifier hand
     */
    private void updateFovModifierHand()
    {
        float var1 = 1.0F;

        if (this.mc.func_175606_aa() instanceof AbstractClientPlayer)
        {
            AbstractClientPlayer var2 = (AbstractClientPlayer)this.mc.func_175606_aa();
            var1 = var2.func_175156_o();
        }

        this.fovModifierHandPrev = this.fovModifierHand;
        this.fovModifierHand += (var1 - this.fovModifierHand) * 0.5F;

        if (this.fovModifierHand > 1.5F)
        {
            this.fovModifierHand = 1.5F;
        }

        if (this.fovModifierHand < 0.1F)
        {
            this.fovModifierHand = 0.1F;
        }
    }

    /**
     * Changes the field of view of the player depending on if they are underwater or not
     */
    private float getFOVModifier(float p_78481_1_, boolean p_78481_2_)
    {
        if (this.field_175078_W)
        {
            return 90.0F;
        }
        else
        {
            Entity var3 = this.mc.func_175606_aa();
            float var4 = 70.0F;

            if (p_78481_2_)
            {
                var4 = this.mc.gameSettings.fovSetting;
                var4 *= this.fovModifierHandPrev + (this.fovModifierHand - this.fovModifierHandPrev) * p_78481_1_;
            }

            if (var3 instanceof EntityLivingBase && ((EntityLivingBase)var3).getHealth() <= 0.0F)
            {
                float var5 = (float)((EntityLivingBase)var3).deathTime + p_78481_1_;
                var4 /= (1.0F - 500.0F / (var5 + 500.0F)) * 2.0F + 1.0F;
            }

            Block var6 = ActiveRenderInfo.func_180786_a(this.mc.theWorld, var3, p_78481_1_);

            if (var6.getMaterial() == Material.water)
            {
                var4 = var4 * 60.0F / 70.0F;
            }

            return var4;
        }
    }

    private void hurtCameraEffect(float p_78482_1_)
    {
        if (this.mc.func_175606_aa() instanceof EntityLivingBase)
        {
            EntityLivingBase var2 = (EntityLivingBase)this.mc.func_175606_aa();
            float var3 = (float)var2.hurtTime - p_78482_1_;
            float var4;

            if (var2.getHealth() <= 0.0F)
            {
                var4 = (float)var2.deathTime + p_78482_1_;
                GlStateManager.rotate(40.0F - 8000.0F / (var4 + 200.0F), 0.0F, 0.0F, 1.0F);
            }

            if (var3 < 0.0F)
            {
                return;
            }

            var3 /= (float)var2.maxHurtTime;
            var3 = MathHelper.sin(var3 * var3 * var3 * var3 * (float)Math.PI);
            var4 = var2.attackedAtYaw;
            GlStateManager.rotate(-var4, 0.0F, 1.0F, 0.0F);
            GlStateManager.rotate(-var3 * 14.0F, 0.0F, 0.0F, 1.0F);
            GlStateManager.rotate(var4, 0.0F, 1.0F, 0.0F);
        }
    }

    /**
     * Setups all the GL settings for view bobbing. Args: partialTickTime
     */
    private void setupViewBobbing(float p_78475_1_)
    {
        if (this.mc.func_175606_aa() instanceof EntityPlayer)
        {
            EntityPlayer var2 = (EntityPlayer)this.mc.func_175606_aa();
            float var3 = var2.distanceWalkedModified - var2.prevDistanceWalkedModified;
            float var4 = -(var2.distanceWalkedModified + var3 * p_78475_1_);
            float var5 = var2.prevCameraYaw + (var2.cameraYaw - var2.prevCameraYaw) * p_78475_1_;
            float var6 = var2.prevCameraPitch + (var2.cameraPitch - var2.prevCameraPitch) * p_78475_1_;
            GlStateManager.translate(MathHelper.sin(var4 * (float)Math.PI) * var5 * 0.5F, -Math.abs(MathHelper.cos(var4 * (float)Math.PI) * var5), 0.0F);
            GlStateManager.rotate(MathHelper.sin(var4 * (float)Math.PI) * var5 * 3.0F, 0.0F, 0.0F, 1.0F);
            GlStateManager.rotate(Math.abs(MathHelper.cos(var4 * (float)Math.PI - 0.2F) * var5) * 5.0F, 1.0F, 0.0F, 0.0F);
            GlStateManager.rotate(var6, 1.0F, 0.0F, 0.0F);
        }
    }

    /**
     * sets up player's eye (or camera in third person mode)
     */
    private void orientCamera(float p_78467_1_)
    {
        Entity var2 = this.mc.func_175606_aa();
        float var3 = var2.getEyeHeight();
        double var4 = var2.prevPosX + (var2.posX - var2.prevPosX) * (double)p_78467_1_;
        double var6 = var2.prevPosY + (var2.posY - var2.prevPosY) * (double)p_78467_1_ + (double)var3;
        double var8 = var2.prevPosZ + (var2.posZ - var2.prevPosZ) * (double)p_78467_1_;

        if (var2 instanceof EntityLivingBase && ((EntityLivingBase)var2).isPlayerSleeping())
        {
            var3 = (float)((double)var3 + 1.0D);
            GlStateManager.translate(0.0F, 0.3F, 0.0F);

            if (!this.mc.gameSettings.debugCamEnable)
            {
                BlockPos var27 = new BlockPos(var2);
                IBlockState var11 = this.mc.theWorld.getBlockState(var27);
                Block var29 = var11.getBlock();

                if (var29 == Blocks.bed)
                {
                    int var30 = ((EnumFacing)var11.getValue(BlockBed.AGE)).getHorizontalIndex();
                    GlStateManager.rotate((float)(var30 * 90), 0.0F, 1.0F, 0.0F);
                }

                GlStateManager.rotate(var2.prevRotationYaw + (var2.rotationYaw - var2.prevRotationYaw) * p_78467_1_ + 180.0F, 0.0F, -1.0F, 0.0F);
                GlStateManager.rotate(var2.prevRotationPitch + (var2.rotationPitch - var2.prevRotationPitch) * p_78467_1_, -1.0F, 0.0F, 0.0F);
            }
        }
        else if (this.mc.gameSettings.thirdPersonView > 0)
        {
            double var10 = (double)(this.thirdPersonDistanceTemp + (this.thirdPersonDistance - this.thirdPersonDistanceTemp) * p_78467_1_);

            if (this.mc.gameSettings.debugCamEnable)
            {
                GlStateManager.translate(0.0F, 0.0F, (float)(-var10));
            }
            else
            {
                float var12 = var2.rotationYaw;
                float var13 = var2.rotationPitch;

                if (this.mc.gameSettings.thirdPersonView == 2)
                {
                    var13 += 180.0F;
                }

                double var14 = (double)(-MathHelper.sin(var12 / 180.0F * (float)Math.PI) * MathHelper.cos(var13 / 180.0F * (float)Math.PI)) * var10;
                double var16 = (double)(MathHelper.cos(var12 / 180.0F * (float)Math.PI) * MathHelper.cos(var13 / 180.0F * (float)Math.PI)) * var10;
                double var18 = (double)(-MathHelper.sin(var13 / 180.0F * (float)Math.PI)) * var10;

                for (int var20 = 0; var20 < 8; ++var20)
                {
                    float var21 = (float)((var20 & 1) * 2 - 1);
                    float var22 = (float)((var20 >> 1 & 1) * 2 - 1);
                    float var23 = (float)((var20 >> 2 & 1) * 2 - 1);
                    var21 *= 0.1F;
                    var22 *= 0.1F;
                    var23 *= 0.1F;
                    MovingObjectPosition var24 = this.mc.theWorld.rayTraceBlocks(new Vec3(var4 + (double)var21, var6 + (double)var22, var8 + (double)var23), new Vec3(var4 - var14 + (double)var21 + (double)var23, var6 - var18 + (double)var22, var8 - var16 + (double)var23));

                    if (var24 != null)
                    {
                        double var25 = var24.hitVec.distanceTo(new Vec3(var4, var6, var8));

                        if (var25 < var10)
                        {
                            var10 = var25;
                        }
                    }
                }

                if (this.mc.gameSettings.thirdPersonView == 2)
                {
                    GlStateManager.rotate(180.0F, 0.0F, 1.0F, 0.0F);
                }

                GlStateManager.rotate(var2.rotationPitch - var13, 1.0F, 0.0F, 0.0F);
                GlStateManager.rotate(var2.rotationYaw - var12, 0.0F, 1.0F, 0.0F);
                GlStateManager.translate(0.0F, 0.0F, (float)(-var10));
                GlStateManager.rotate(var12 - var2.rotationYaw, 0.0F, 1.0F, 0.0F);
                GlStateManager.rotate(var13 - var2.rotationPitch, 1.0F, 0.0F, 0.0F);
            }
        }
        else
        {
            GlStateManager.translate(0.0F, 0.0F, -0.1F);
        }

        if (!this.mc.gameSettings.debugCamEnable)
        {
            GlStateManager.rotate(var2.prevRotationPitch + (var2.rotationPitch - var2.prevRotationPitch) * p_78467_1_, 1.0F, 0.0F, 0.0F);

            if (var2 instanceof EntityAnimal)
            {
                EntityAnimal var28 = (EntityAnimal)var2;
                GlStateManager.rotate(var28.prevRotationYawHead + (var28.rotationYawHead - var28.prevRotationYawHead) * p_78467_1_ + 180.0F, 0.0F, 1.0F, 0.0F);
            }
            else
            {
                GlStateManager.rotate(var2.prevRotationYaw + (var2.rotationYaw - var2.prevRotationYaw) * p_78467_1_ + 180.0F, 0.0F, 1.0F, 0.0F);
            }
        }

        GlStateManager.translate(0.0F, -var3, 0.0F);
        var4 = var2.prevPosX + (var2.posX - var2.prevPosX) * (double)p_78467_1_;
        var6 = var2.prevPosY + (var2.posY - var2.prevPosY) * (double)p_78467_1_ + (double)var3;
        var8 = var2.prevPosZ + (var2.posZ - var2.prevPosZ) * (double)p_78467_1_;
        this.cloudFog = this.mc.renderGlobal.hasCloudFog(var4, var6, var8, p_78467_1_);
    }

    /**
     * sets up projection, view effects, camera position/rotation
     */
    private void setupCameraTransform(float p_78479_1_, int p_78479_2_)
    {
        this.farPlaneDistance = (float)(this.mc.gameSettings.renderDistanceChunks * 16);
        GlStateManager.matrixMode(5889);
        GlStateManager.loadIdentity();
        float var3 = 0.07F;

        if (this.mc.gameSettings.anaglyph)
        {
            GlStateManager.translate((float)(-(p_78479_2_ * 2 - 1)) * var3, 0.0F, 0.0F);
        }

        if (this.cameraZoom != 1.0D)
        {
            GlStateManager.translate((float)this.cameraYaw, (float)(-this.cameraPitch), 0.0F);
            GlStateManager.scale(this.cameraZoom, this.cameraZoom, 1.0D);
        }

        Project.gluPerspective(this.getFOVModifier(p_78479_1_, true), (float)this.mc.displayWidth / (float)this.mc.displayHeight, 0.05F, this.farPlaneDistance * MathHelper.field_180189_a);
        GlStateManager.matrixMode(5888);
        GlStateManager.loadIdentity();

        if (this.mc.gameSettings.anaglyph)
        {
            GlStateManager.translate((float)(p_78479_2_ * 2 - 1) * 0.1F, 0.0F, 0.0F);
        }

        this.hurtCameraEffect(p_78479_1_);

        if (this.mc.gameSettings.viewBobbing)
        {
            this.setupViewBobbing(p_78479_1_);
        }

        float var4 = this.mc.thePlayer.prevTimeInPortal + (this.mc.thePlayer.timeInPortal - this.mc.thePlayer.prevTimeInPortal) * p_78479_1_;

        if (var4 > 0.0F)
        {
            byte var5 = 20;

            if (this.mc.thePlayer.isPotionActive(Potion.confusion))
            {
                var5 = 7;
            }

            float var6 = 5.0F / (var4 * var4 + 5.0F) - var4 * 0.04F;
            var6 *= var6;
            GlStateManager.rotate(((float)this.rendererUpdateCount + p_78479_1_) * (float)var5, 0.0F, 1.0F, 1.0F);
            GlStateManager.scale(1.0F / var6, 1.0F, 1.0F);
            GlStateManager.rotate(-((float)this.rendererUpdateCount + p_78479_1_) * (float)var5, 0.0F, 1.0F, 1.0F);
        }

        this.orientCamera(p_78479_1_);

        if (this.field_175078_W)
        {
            switch (this.field_175079_V)
            {
                case 0:
                    GlStateManager.rotate(90.0F, 0.0F, 1.0F, 0.0F);
                    break;

                case 1:
                    GlStateManager.rotate(180.0F, 0.0F, 1.0F, 0.0F);
                    break;

                case 2:
                    GlStateManager.rotate(-90.0F, 0.0F, 1.0F, 0.0F);
                    break;

                case 3:
                    GlStateManager.rotate(90.0F, 1.0F, 0.0F, 0.0F);
                    break;

                case 4:
                    GlStateManager.rotate(-90.0F, 1.0F, 0.0F, 0.0F);
            }
        }
    }

    /**
     * Render player hand
     */
    private void renderHand(float p_78476_1_, int p_78476_2_)
    {
        if (!this.field_175078_W)
        {
            GlStateManager.matrixMode(5889);
            GlStateManager.loadIdentity();
            float var3 = 0.07F;

            if (this.mc.gameSettings.anaglyph)
            {
                GlStateManager.translate((float)(-(p_78476_2_ * 2 - 1)) * var3, 0.0F, 0.0F);
            }

            Project.gluPerspective(this.getFOVModifier(p_78476_1_, false), (float)this.mc.displayWidth / (float)this.mc.displayHeight, 0.05F, this.farPlaneDistance * 2.0F);
            GlStateManager.matrixMode(5888);
            GlStateManager.loadIdentity();

            if (this.mc.gameSettings.anaglyph)
            {
                GlStateManager.translate((float)(p_78476_2_ * 2 - 1) * 0.1F, 0.0F, 0.0F);
            }

            GlStateManager.pushMatrix();
            this.hurtCameraEffect(p_78476_1_);

            if (this.mc.gameSettings.viewBobbing)
            {
                this.setupViewBobbing(p_78476_1_);
            }

            boolean var4 = this.mc.func_175606_aa() instanceof EntityLivingBase && ((EntityLivingBase)this.mc.func_175606_aa()).isPlayerSleeping();

            if (this.mc.gameSettings.thirdPersonView == 0 && !var4 && !this.mc.gameSettings.hideGUI && !this.mc.playerController.enableEverythingIsScrewedUpMode())
            {
                this.func_180436_i();
                this.itemRenderer.renderItemInFirstPerson(p_78476_1_);
                this.func_175072_h();
            }

            GlStateManager.popMatrix();

            if (this.mc.gameSettings.thirdPersonView == 0 && !var4)
            {
                this.itemRenderer.renderOverlays(p_78476_1_);
                this.hurtCameraEffect(p_78476_1_);
            }

            if (this.mc.gameSettings.viewBobbing)
            {
                this.setupViewBobbing(p_78476_1_);
            }
        }
    }

    public void func_175072_h()
    {
        GlStateManager.setActiveTexture(OpenGlHelper.lightmapTexUnit);
        GlStateManager.func_179090_x();
        GlStateManager.setActiveTexture(OpenGlHelper.defaultTexUnit);
    }

    public void func_180436_i()
    {
        GlStateManager.setActiveTexture(OpenGlHelper.lightmapTexUnit);
        GlStateManager.matrixMode(5890);
        GlStateManager.loadIdentity();
        float var1 = 0.00390625F;
        GlStateManager.scale(var1, var1, var1);
        GlStateManager.translate(8.0F, 8.0F, 8.0F);
        GlStateManager.matrixMode(5888);
        this.mc.getTextureManager().bindTexture(this.locationLightMap);
        GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MIN_FILTER, GL11.GL_LINEAR);
        GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MAG_FILTER, GL11.GL_LINEAR);
        GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_S, GL11.GL_CLAMP);
        GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_T, GL11.GL_CLAMP);
        GlStateManager.color(1.0F, 1.0F, 1.0F, 1.0F);
        GlStateManager.func_179098_w();
        GlStateManager.setActiveTexture(OpenGlHelper.defaultTexUnit);
    }

    /**
     * Recompute a random value that is applied to block color in updateLightmap()
     */
    private void updateTorchFlicker()
    {
        this.field_175075_L = (float)((double)this.field_175075_L + (Math.random() - Math.random()) * Math.random() * Math.random());
        this.field_175075_L = (float)((double)this.field_175075_L * 0.9D);
        this.torchFlickerX += (this.field_175075_L - this.torchFlickerX) * 1.0F;
        this.lightmapUpdateNeeded = true;
    }

    private void updateLightmap(float p_78472_1_)
    {
        if (this.lightmapUpdateNeeded)
        {
            this.mc.mcProfiler.startSection("lightTex");
            WorldClient var2 = this.mc.theWorld;

            if (var2 != null)
            {
                for (int var3 = 0; var3 < 256; ++var3)
                {
                    float var4 = var2.getSunBrightness(1.0F) * 0.95F + 0.05F;
                    float var5 = var2.provider.getLightBrightnessTable()[var3 / 16] * var4;
                    float var6 = var2.provider.getLightBrightnessTable()[var3 % 16] * (this.torchFlickerX * 0.1F + 1.5F);

                    if (var2.func_175658_ac() > 0)
                    {
                        var5 = var2.provider.getLightBrightnessTable()[var3 / 16];
                    }

                    float var7 = var5 * (var2.getSunBrightness(1.0F) * 0.65F + 0.35F);
                    float var8 = var5 * (var2.getSunBrightness(1.0F) * 0.65F + 0.35F);
                    float var11 = var6 * ((var6 * 0.6F + 0.4F) * 0.6F + 0.4F);
                    float var12 = var6 * (var6 * var6 * 0.6F + 0.4F);
                    float var13 = var7 + var6;
                    float var14 = var8 + var11;
                    float var15 = var5 + var12;
                    var13 = var13 * 0.96F + 0.03F;
                    var14 = var14 * 0.96F + 0.03F;
                    var15 = var15 * 0.96F + 0.03F;
                    float var16;

                    if (this.bossColorModifier > 0.0F)
                    {
                        var16 = this.bossColorModifierPrev + (this.bossColorModifier - this.bossColorModifierPrev) * p_78472_1_;
                        var13 = var13 * (1.0F - var16) + var13 * 0.7F * var16;
                        var14 = var14 * (1.0F - var16) + var14 * 0.6F * var16;
                        var15 = var15 * (1.0F - var16) + var15 * 0.6F * var16;
                    }

                    if (var2.provider.getDimensionId() == 1)
                    {
                        var13 = 0.22F + var6 * 0.75F;
                        var14 = 0.28F + var11 * 0.75F;
                        var15 = 0.25F + var12 * 0.75F;
                    }

                    float var17;

                    if (this.mc.thePlayer.isPotionActive(Potion.nightVision))
                    {
                        var16 = this.func_180438_a(this.mc.thePlayer, p_78472_1_);
                        var17 = 1.0F / var13;

                        if (var17 > 1.0F / var14)
                        {
                            var17 = 1.0F / var14;
                        }

                        if (var17 > 1.0F / var15)
                        {
                            var17 = 1.0F / var15;
                        }

                        var13 = var13 * (1.0F - var16) + var13 * var17 * var16;
                        var14 = var14 * (1.0F - var16) + var14 * var17 * var16;
                        var15 = var15 * (1.0F - var16) + var15 * var17 * var16;
                    }

                    if (var13 > 1.0F)
                    {
                        var13 = 1.0F;
                    }

                    if (var14 > 1.0F)
                    {
                        var14 = 1.0F;
                    }

                    if (var15 > 1.0F)
                    {
                        var15 = 1.0F;
                    }

                    var16 = this.mc.gameSettings.gammaSetting;
                    var17 = 1.0F - var13;
                    float var18 = 1.0F - var14;
                    float var19 = 1.0F - var15;
                    var17 = 1.0F - var17 * var17 * var17 * var17;
                    var18 = 1.0F - var18 * var18 * var18 * var18;
                    var19 = 1.0F - var19 * var19 * var19 * var19;
                    var13 = var13 * (1.0F - var16) + var17 * var16;
                    var14 = var14 * (1.0F - var16) + var18 * var16;
                    var15 = var15 * (1.0F - var16) + var19 * var16;
                    var13 = var13 * 0.96F + 0.03F;
                    var14 = var14 * 0.96F + 0.03F;
                    var15 = var15 * 0.96F + 0.03F;

                    if (var13 > 1.0F)
                    {
                        var13 = 1.0F;
                    }

                    if (var14 > 1.0F)
                    {
                        var14 = 1.0F;
                    }

                    if (var15 > 1.0F)
                    {
                        var15 = 1.0F;
                    }

                    if (var13 < 0.0F)
                    {
                        var13 = 0.0F;
                    }

                    if (var14 < 0.0F)
                    {
                        var14 = 0.0F;
                    }

                    if (var15 < 0.0F)
                    {
                        var15 = 0.0F;
                    }

                    short var20 = 255;
                    int var21 = (int)(var13 * 255.0F);
                    int var22 = (int)(var14 * 255.0F);
                    int var23 = (int)(var15 * 255.0F);
                    this.lightmapColors[var3] = var20 << 24 | var21 << 16 | var22 << 8 | var23;
                }

                this.lightmapTexture.updateDynamicTexture();
                this.lightmapUpdateNeeded = false;
                this.mc.mcProfiler.endSection();
            }
        }
    }

    private float func_180438_a(EntityLivingBase p_180438_1_, float p_180438_2_)
    {
        int var3 = p_180438_1_.getActivePotionEffect(Potion.nightVision).getDuration();
        return var3 > 200 ? 1.0F : 0.7F + MathHelper.sin(((float)var3 - p_180438_2_) * (float)Math.PI * 0.2F) * 0.3F;
    }

    /**
     * Will update any inputs that effect the camera angle (mouse) and then render the world and GUI
     */
    public void updateCameraAndRender(float p_78480_1_)
    {
        boolean var2 = Display.isActive();

        if (!var2 && this.mc.gameSettings.pauseOnLostFocus && (!this.mc.gameSettings.touchscreen || !Mouse.isButtonDown(1)))
        {
            if (Minecraft.getSystemTime() - this.prevFrameTime > 500L)
            {
                this.mc.displayInGameMenu();
            }
        }
        else
        {
            this.prevFrameTime = Minecraft.getSystemTime();
        }

        this.mc.mcProfiler.startSection("mouse");

        if (var2 && Minecraft.isRunningOnMac && this.mc.inGameHasFocus && !Mouse.isInsideWindow())
        {
            Mouse.setGrabbed(false);
            Mouse.setCursorPosition(Display.getWidth() / 2, Display.getHeight() / 2);
            Mouse.setGrabbed(true);
        }

        if (this.mc.inGameHasFocus && var2)
        {
            this.mc.mouseHelper.mouseXYChange();
            float var3 = this.mc.gameSettings.mouseSensitivity * 0.6F + 0.2F;
            float var4 = var3 * var3 * var3 * 8.0F;
            float var5 = (float)this.mc.mouseHelper.deltaX * var4;
            float var6 = (float)this.mc.mouseHelper.deltaY * var4;
            byte var7 = 1;

            if (this.mc.gameSettings.invertMouse)
            {
                var7 = -1;
            }

            if (this.mc.gameSettings.smoothCamera)
            {
                this.smoothCamYaw += var5;
                this.smoothCamPitch += var6;
                float var8 = p_78480_1_ - this.smoothCamPartialTicks;
                this.smoothCamPartialTicks = p_78480_1_;
                var5 = this.smoothCamFilterX * var8;
                var6 = this.smoothCamFilterY * var8;
                this.mc.thePlayer.setAngles(var5, var6 * (float)var7);
            }
            else
            {
                this.smoothCamYaw = 0.0F;
                this.smoothCamPitch = 0.0F;
                this.mc.thePlayer.setAngles(var5, var6 * (float)var7);
            }
        }

        this.mc.mcProfiler.endSection();

        if (!this.mc.skipRenderWorld)
        {
            anaglyphEnable = this.mc.gameSettings.anaglyph;
            final ScaledResolution var13 = new ScaledResolution(this.mc, this.mc.displayWidth, this.mc.displayHeight);
            int var14 = var13.getScaledWidth();
            int var15 = var13.getScaledHeight();
            final int var16 = Mouse.getX() * var14 / this.mc.displayWidth;
            final int var17 = var15 - Mouse.getY() * var15 / this.mc.displayHeight - 1;
            int var18 = this.mc.gameSettings.limitFramerate;

            if (this.mc.theWorld != null)
            {
                this.mc.mcProfiler.startSection("level");
                int var9 = Math.max(Minecraft.func_175610_ah(), 30);
                this.renderWorld(p_78480_1_, this.renderEndNanoTime + (long)(1000000000 / var9));

                if (OpenGlHelper.shadersSupported)
                {
                    this.mc.renderGlobal.func_174975_c();

                    if (this.theShaderGroup != null && this.field_175083_ad)
                    {
                        GlStateManager.matrixMode(5890);
                        GlStateManager.pushMatrix();
                        GlStateManager.loadIdentity();
                        this.theShaderGroup.loadShaderGroup(p_78480_1_);
                        GlStateManager.popMatrix();
                    }

                    this.mc.getFramebuffer().bindFramebuffer(true);
                }

                this.renderEndNanoTime = System.nanoTime();
                this.mc.mcProfiler.endStartSection("gui");

                if (!this.mc.gameSettings.hideGUI || this.mc.currentScreen != null)
                {
                    GlStateManager.alphaFunc(516, 0.1F);
                    this.mc.ingameGUI.func_175180_a(p_78480_1_);
                }

                this.mc.mcProfiler.endSection();
            }
            else
            {
                GlStateManager.viewport(0, 0, this.mc.displayWidth, this.mc.displayHeight);
                GlStateManager.matrixMode(5889);
                GlStateManager.loadIdentity();
                GlStateManager.matrixMode(5888);
                GlStateManager.loadIdentity();
                this.setupOverlayRendering();
                this.renderEndNanoTime = System.nanoTime();
            }

            if (this.mc.currentScreen != null)
            {
                GlStateManager.clear(256);

                try
                {
                    this.mc.currentScreen.drawScreen(var16, var17, p_78480_1_);
                }
                catch (Throwable var12)
                {
                    CrashReport var10 = CrashReport.makeCrashReport(var12, "Rendering screen");
                    CrashReportCategory var11 = var10.makeCategory("Screen render details");
                    var11.addCrashSectionCallable("Screen name", new Callable()
                    {
                        private static final String __OBFID = "CL_00000948";
                        public String call()
                        {
                            return EntityRenderer.this.mc.currentScreen.getClass().getCanonicalName();
                        }
                    });
                    var11.addCrashSectionCallable("Mouse location", new Callable()
                    {
                        private static final String __OBFID = "CL_00000950";
                        public String call()
                        {
                            return String.format("Scaled: (%d, %d). Absolute: (%d, %d)", new Object[] {Integer.valueOf(var16), Integer.valueOf(var17), Integer.valueOf(Mouse.getX()), Integer.valueOf(Mouse.getY())});
                        }
                    });
                    var11.addCrashSectionCallable("Screen size", new Callable()
                    {
                        private static final String __OBFID = "CL_00000951";
                        public String call()
                        {
                            return String.format("Scaled: (%d, %d). Absolute: (%d, %d). Scale factor of %d", new Object[] {Integer.valueOf(var13.getScaledWidth()), Integer.valueOf(var13.getScaledHeight()), Integer.valueOf(EntityRenderer.this.mc.displayWidth), Integer.valueOf(EntityRenderer.this.mc.displayHeight), Integer.valueOf(var13.getScaleFactor())});
                        }
                    });
                    throw new ReportedException(var10);
                }
            }
        }
    }

    public void func_152430_c(float p_152430_1_)
    {
        this.setupOverlayRendering();
        this.mc.ingameGUI.func_180478_c(new ScaledResolution(this.mc, this.mc.displayWidth, this.mc.displayHeight));
    }

    private boolean func_175070_n()
    {
        if (!this.field_175073_D)
        {
            return false;
        }
        else
        {
            Entity var1 = this.mc.func_175606_aa();
            boolean var2 = var1 instanceof EntityPlayer && !this.mc.gameSettings.hideGUI;

            if (var2 && !((EntityPlayer)var1).capabilities.allowEdit)
            {
                ItemStack var3 = ((EntityPlayer)var1).getCurrentEquippedItem();

                if (this.mc.objectMouseOver != null && this.mc.objectMouseOver.typeOfHit == MovingObjectPosition.MovingObjectType.BLOCK)
                {
                    BlockPos var4 = this.mc.objectMouseOver.func_178782_a();
                    Block var5 = this.mc.theWorld.getBlockState(var4).getBlock();

                    if (this.mc.playerController.func_178889_l() == WorldSettings.GameType.SPECTATOR)
                    {
                        var2 = var5.hasTileEntity() && this.mc.theWorld.getTileEntity(var4) instanceof IInventory;
                    }
                    else
                    {
                        var2 = var3 != null && (var3.canDestroy(var5) || var3.canPlaceOn(var5));
                    }
                }
            }

            return var2;
        }
    }

    private void func_175067_i(float p_175067_1_)
    {
        if (this.mc.gameSettings.showDebugInfo && !this.mc.gameSettings.hideGUI && !this.mc.thePlayer.func_175140_cp() && !this.mc.gameSettings.field_178879_v)
        {
            Entity var2 = this.mc.func_175606_aa();
            GlStateManager.enableBlend();
            GlStateManager.tryBlendFuncSeparate(770, 771, 1, 0);
            GL11.glLineWidth(1.0F);
            GlStateManager.func_179090_x();
            GlStateManager.depthMask(false);
            GlStateManager.pushMatrix();
            GlStateManager.matrixMode(5888);
            GlStateManager.loadIdentity();
            this.orientCamera(p_175067_1_);
            GlStateManager.translate(0.0F, var2.getEyeHeight(), 0.0F);
            RenderGlobal.drawOutlinedBoundingBox(new AxisAlignedBB(0.0D, 0.0D, 0.0D, 0.005D, 1.0E-4D, 1.0E-4D), -65536);
            RenderGlobal.drawOutlinedBoundingBox(new AxisAlignedBB(0.0D, 0.0D, 0.0D, 1.0E-4D, 1.0E-4D, 0.005D), -16776961);
            RenderGlobal.drawOutlinedBoundingBox(new AxisAlignedBB(0.0D, 0.0D, 0.0D, 1.0E-4D, 0.0033D, 1.0E-4D), -16711936);
            GlStateManager.popMatrix();
            GlStateManager.depthMask(true);
            GlStateManager.func_179098_w();
            GlStateManager.disableBlend();
        }
    }

    public void renderWorld(float p_78471_1_, long p_78471_2_)
    {
        this.updateLightmap(p_78471_1_);

        if (this.mc.func_175606_aa() == null)
        {
            this.mc.func_175607_a(this.mc.thePlayer);
        }

        this.getMouseOver(p_78471_1_);
        GlStateManager.enableDepth();
        GlStateManager.enableAlpha();
        GlStateManager.alphaFunc(516, 0.5F);
        this.mc.mcProfiler.startSection("center");

        if (this.mc.gameSettings.anaglyph)
        {
            anaglyphField = 0;
            GlStateManager.colorMask(false, true, true, false);
            this.func_175068_a(0, p_78471_1_, p_78471_2_);
            anaglyphField = 1;
            GlStateManager.colorMask(true, false, false, false);
            this.func_175068_a(1, p_78471_1_, p_78471_2_);
            GlStateManager.colorMask(true, true, true, false);
        }
        else
        {
            this.func_175068_a(2, p_78471_1_, p_78471_2_);
        }

        this.mc.mcProfiler.endSection();
    }

    private void func_175068_a(int p_175068_1_, float p_175068_2_, long p_175068_3_)
    {
        RenderGlobal var5 = this.mc.renderGlobal;
        EffectRenderer var6 = this.mc.effectRenderer;
        boolean var7 = this.func_175070_n();
        GlStateManager.enableCull();
        this.mc.mcProfiler.endStartSection("clear");
        GlStateManager.viewport(0, 0, this.mc.displayWidth, this.mc.displayHeight);
        this.updateFogColor(p_175068_2_);
        GlStateManager.clear(16640);
        this.mc.mcProfiler.endStartSection("camera");
        this.setupCameraTransform(p_175068_2_, p_175068_1_);
        ActiveRenderInfo.updateRenderInfo(this.mc.thePlayer, this.mc.gameSettings.thirdPersonView == 2);
        this.mc.mcProfiler.endStartSection("frustum");
        ClippingHelperImpl.getInstance();
        this.mc.mcProfiler.endStartSection("culling");
        Frustrum var8 = new Frustrum();
        Entity var9 = this.mc.func_175606_aa();
        double var10 = var9.lastTickPosX + (var9.posX - var9.lastTickPosX) * (double)p_175068_2_;
        double var12 = var9.lastTickPosY + (var9.posY - var9.lastTickPosY) * (double)p_175068_2_;
        double var14 = var9.lastTickPosZ + (var9.posZ - var9.lastTickPosZ) * (double)p_175068_2_;
        var8.setPosition(var10, var12, var14);

        if (this.mc.gameSettings.renderDistanceChunks >= 4)
        {
            this.setupFog(-1, p_175068_2_);
            this.mc.mcProfiler.endStartSection("sky");
            GlStateManager.matrixMode(5889);
            GlStateManager.loadIdentity();
            Project.gluPerspective(this.getFOVModifier(p_175068_2_, true), (float)this.mc.displayWidth / (float)this.mc.displayHeight, 0.05F, this.farPlaneDistance * 2.0F);
            GlStateManager.matrixMode(5888);
            var5.func_174976_a(p_175068_2_, p_175068_1_);
            GlStateManager.matrixMode(5889);
            GlStateManager.loadIdentity();
            Project.gluPerspective(this.getFOVModifier(p_175068_2_, true), (float)this.mc.displayWidth / (float)this.mc.displayHeight, 0.05F, this.farPlaneDistance * MathHelper.field_180189_a);
            GlStateManager.matrixMode(5888);
        }

        this.setupFog(0, p_175068_2_);
        GlStateManager.shadeModel(7425);

        if (var9.posY + (double)var9.getEyeHeight() < 128.0D)
        {
            this.func_180437_a(var5, p_175068_2_, p_175068_1_);
        }

        this.mc.mcProfiler.endStartSection("prepareterrain");
        this.setupFog(0, p_175068_2_);
        this.mc.getTextureManager().bindTexture(TextureMap.locationBlocksTexture);
        RenderHelper.disableStandardItemLighting();
        this.mc.mcProfiler.endStartSection("terrain_setup");
        var5.func_174970_a(var9, (double)p_175068_2_, var8, this.field_175084_ae++, this.mc.thePlayer.func_175149_v());

        if (p_175068_1_ == 0 || p_175068_1_ == 2)
        {
            this.mc.mcProfiler.endStartSection("updatechunks");
            this.mc.renderGlobal.func_174967_a(p_175068_3_);
        }

        this.mc.mcProfiler.endStartSection("terrain");
        GlStateManager.matrixMode(5888);
        GlStateManager.pushMatrix();
        GlStateManager.disableAlpha();
        var5.func_174977_a(EnumWorldBlockLayer.SOLID, (double)p_175068_2_, p_175068_1_, var9);
        GlStateManager.enableAlpha();
        var5.func_174977_a(EnumWorldBlockLayer.CUTOUT_MIPPED, (double)p_175068_2_, p_175068_1_, var9);
        this.mc.getTextureManager().getTexture(TextureMap.locationBlocksTexture).func_174936_b(false, false);
        var5.func_174977_a(EnumWorldBlockLayer.CUTOUT, (double)p_175068_2_, p_175068_1_, var9);
        this.mc.getTextureManager().getTexture(TextureMap.locationBlocksTexture).func_174935_a();
        GlStateManager.shadeModel(7424);
        GlStateManager.alphaFunc(516, 0.1F);
        EntityPlayer var16;

        if (!this.field_175078_W)
        {
            GlStateManager.matrixMode(5888);
            GlStateManager.popMatrix();
            GlStateManager.pushMatrix();
            RenderHelper.enableStandardItemLighting();
            this.mc.mcProfiler.endStartSection("entities");
            var5.func_180446_a(var9, var8, p_175068_2_);
            RenderHelper.disableStandardItemLighting();
            this.func_175072_h();
            GlStateManager.matrixMode(5888);
            GlStateManager.popMatrix();
            GlStateManager.pushMatrix();

            if (this.mc.objectMouseOver != null && var9.isInsideOfMaterial(Material.water) && var7)
            {
                var16 = (EntityPlayer)var9;
                GlStateManager.disableAlpha();
                this.mc.mcProfiler.endStartSection("outline");
                var5.drawSelectionBox(var16, this.mc.objectMouseOver, 0, p_175068_2_);
                GlStateManager.enableAlpha();
            }
        }

        GlStateManager.matrixMode(5888);
        GlStateManager.popMatrix();

        if (var7 && this.mc.objectMouseOver != null && !var9.isInsideOfMaterial(Material.water))
        {
            var16 = (EntityPlayer)var9;
            GlStateManager.disableAlpha();
            this.mc.mcProfiler.endStartSection("outline");
            var5.drawSelectionBox(var16, this.mc.objectMouseOver, 0, p_175068_2_);
            GlStateManager.enableAlpha();
        }

        this.mc.mcProfiler.endStartSection("destroyProgress");
        GlStateManager.enableBlend();
        GlStateManager.tryBlendFuncSeparate(770, 1, 1, 0);
        var5.func_174981_a(Tessellator.getInstance(), Tessellator.getInstance().getWorldRenderer(), var9, p_175068_2_);
        GlStateManager.disableBlend();

        if (!this.field_175078_W)
        {
            this.func_180436_i();
            this.mc.mcProfiler.endStartSection("litParticles");
            var6.renderLitParticles(var9, p_175068_2_);
            RenderHelper.disableStandardItemLighting();
            this.setupFog(0, p_175068_2_);
            this.mc.mcProfiler.endStartSection("particles");
            var6.renderParticles(var9, p_175068_2_);
            this.func_175072_h();
        }

        GlStateManager.depthMask(false);
        GlStateManager.enableCull();
        this.mc.mcProfiler.endStartSection("weather");
        this.renderRainSnow(p_175068_2_);
        GlStateManager.depthMask(true);
        var5.func_180449_a(var9, p_175068_2_);
        GlStateManager.disableBlend();
        GlStateManager.enableCull();
        GlStateManager.tryBlendFuncSeparate(770, 771, 1, 0);
        GlStateManager.alphaFunc(516, 0.1F);
        this.setupFog(0, p_175068_2_);
        GlStateManager.enableBlend();
        GlStateManager.depthMask(false);
        this.mc.getTextureManager().bindTexture(TextureMap.locationBlocksTexture);
        GlStateManager.shadeModel(7425);

        if (this.mc.gameSettings.fancyGraphics)
        {
            this.mc.mcProfiler.endStartSection("translucent");
            GlStateManager.enableBlend();
            GlStateManager.tryBlendFuncSeparate(770, 771, 1, 0);
            var5.func_174977_a(EnumWorldBlockLayer.TRANSLUCENT, (double)p_175068_2_, p_175068_1_, var9);
            GlStateManager.disableBlend();
        }
        else
        {
            this.mc.mcProfiler.endStartSection("translucent");
            var5.func_174977_a(EnumWorldBlockLayer.TRANSLUCENT, (double)p_175068_2_, p_175068_1_, var9);
        }

        GlStateManager.shadeModel(7424);
        GlStateManager.depthMask(true);
        GlStateManager.enableCull();
        GlStateManager.disableBlend();
        GlStateManager.disableFog();

        if (var9.posY + (double)var9.getEyeHeight() >= 128.0D)
        {
            this.mc.mcProfiler.endStartSection("aboveClouds");
            this.func_180437_a(var5, p_175068_2_, p_175068_1_);
        }

        this.mc.mcProfiler.endStartSection("hand");

        if (this.field_175074_C)
        {
            GlStateManager.clear(256);
            this.renderHand(p_175068_2_, p_175068_1_);
            this.func_175067_i(p_175068_2_);
        }
    }

    private void func_180437_a(RenderGlobal p_180437_1_, float p_180437_2_, int p_180437_3_)
    {
        if (this.mc.gameSettings.shouldRenderClouds())
        {
            this.mc.mcProfiler.endStartSection("clouds");
            GlStateManager.matrixMode(5889);
            GlStateManager.loadIdentity();
            Project.gluPerspective(this.getFOVModifier(p_180437_2_, true), (float)this.mc.displayWidth / (float)this.mc.displayHeight, 0.05F, this.farPlaneDistance * 4.0F);
            GlStateManager.matrixMode(5888);
            GlStateManager.pushMatrix();
            this.setupFog(0, p_180437_2_);
            p_180437_1_.func_180447_b(p_180437_2_, p_180437_3_);
            GlStateManager.disableFog();
            GlStateManager.popMatrix();
            GlStateManager.matrixMode(5889);
            GlStateManager.loadIdentity();
            Project.gluPerspective(this.getFOVModifier(p_180437_2_, true), (float)this.mc.displayWidth / (float)this.mc.displayHeight, 0.05F, this.farPlaneDistance * MathHelper.field_180189_a);
            GlStateManager.matrixMode(5888);
        }
    }

    private void addRainParticles()
    {
        float var1 = this.mc.theWorld.getRainStrength(1.0F);

        if (!this.mc.gameSettings.fancyGraphics)
        {
            var1 /= 2.0F;
        }

        if (var1 != 0.0F)
        {
            this.random.setSeed((long)this.rendererUpdateCount * 312987231L);
            Entity var2 = this.mc.func_175606_aa();
            WorldClient var3 = this.mc.theWorld;
            BlockPos var4 = new BlockPos(var2);
            byte var5 = 10;
            double var6 = 0.0D;
            double var8 = 0.0D;
            double var10 = 0.0D;
            int var12 = 0;
            int var13 = (int)(100.0F * var1 * var1);

            if (this.mc.gameSettings.particleSetting == 1)
            {
                var13 >>= 1;
            }
            else if (this.mc.gameSettings.particleSetting == 2)
            {
                var13 = 0;
            }

            for (int var14 = 0; var14 < var13; ++var14)
            {
                BlockPos var15 = var3.func_175725_q(var4.add(this.random.nextInt(var5) - this.random.nextInt(var5), 0, this.random.nextInt(var5) - this.random.nextInt(var5)));
                BiomeGenBase var16 = var3.getBiomeGenForCoords(var15);
                BlockPos var17 = var15.offsetDown();
                Block var18 = var3.getBlockState(var17).getBlock();

                if (var15.getY() <= var4.getY() + var5 && var15.getY() >= var4.getY() - var5 && var16.canSpawnLightningBolt() && var16.func_180626_a(var15) >= 0.15F)
                {
                    float var19 = this.random.nextFloat();
                    float var20 = this.random.nextFloat();

                    if (var18.getMaterial() == Material.lava)
                    {
                        this.mc.theWorld.spawnParticle(EnumParticleTypes.SMOKE_NORMAL, (double)((float)var15.getX() + var19), (double)((float)var15.getY() + 0.1F) - var18.getBlockBoundsMinY(), (double)((float)var15.getZ() + var20), 0.0D, 0.0D, 0.0D, new int[0]);
                    }
                    else if (var18.getMaterial() != Material.air)
                    {
                        var18.setBlockBoundsBasedOnState(var3, var17);
                        ++var12;

                        if (this.random.nextInt(var12) == 0)
                        {
                            var6 = (double)((float)var17.getX() + var19);
                            var8 = (double)((float)var17.getY() + 0.1F) + var18.getBlockBoundsMaxY() - 1.0D;
                            var10 = (double)((float)var17.getZ() + var20);
                        }

                        this.mc.theWorld.spawnParticle(EnumParticleTypes.WATER_DROP, (double)((float)var17.getX() + var19), (double)((float)var17.getY() + 0.1F) + var18.getBlockBoundsMaxY(), (double)((float)var17.getZ() + var20), 0.0D, 0.0D, 0.0D, new int[0]);
                    }
                }
            }

            if (var12 > 0 && this.random.nextInt(3) < this.rainSoundCounter++)
            {
                this.rainSoundCounter = 0;

                if (var8 > (double)(var4.getY() + 1) && var3.func_175725_q(var4).getY() > MathHelper.floor_float((float)var4.getY()))
                {
                    this.mc.theWorld.playSound(var6, var8, var10, "ambient.weather.rain", 0.1F, 0.5F, false);
                }
                else
                {
                    this.mc.theWorld.playSound(var6, var8, var10, "ambient.weather.rain", 0.2F, 1.0F, false);
                }
            }
        }
    }

    /**
     * Render rain and snow
     */
    protected void renderRainSnow(float p_78474_1_)
    {
        float var2 = this.mc.theWorld.getRainStrength(p_78474_1_);

        if (var2 > 0.0F)
        {
            this.func_180436_i();
            Entity var3 = this.mc.func_175606_aa();
            WorldClient var4 = this.mc.theWorld;
            int var5 = MathHelper.floor_double(var3.posX);
            int var6 = MathHelper.floor_double(var3.posY);
            int var7 = MathHelper.floor_double(var3.posZ);
            Tessellator var8 = Tessellator.getInstance();
            WorldRenderer var9 = var8.getWorldRenderer();
            GlStateManager.disableCull();
            GL11.glNormal3f(0.0F, 1.0F, 0.0F);
            GlStateManager.enableBlend();
            GlStateManager.tryBlendFuncSeparate(770, 771, 1, 0);
            GlStateManager.alphaFunc(516, 0.1F);
            double var10 = var3.lastTickPosX + (var3.posX - var3.lastTickPosX) * (double)p_78474_1_;
            double var12 = var3.lastTickPosY + (var3.posY - var3.lastTickPosY) * (double)p_78474_1_;
            double var14 = var3.lastTickPosZ + (var3.posZ - var3.lastTickPosZ) * (double)p_78474_1_;
            int var16 = MathHelper.floor_double(var12);
            byte var17 = 5;

            if (this.mc.gameSettings.fancyGraphics)
            {
                var17 = 10;
            }

            byte var18 = -1;
            float var19 = (float)this.rendererUpdateCount + p_78474_1_;

            if (this.mc.gameSettings.fancyGraphics)
            {
                var17 = 10;
            }

            GlStateManager.color(1.0F, 1.0F, 1.0F, 1.0F);

            for (int var20 = var7 - var17; var20 <= var7 + var17; ++var20)
            {
                for (int var21 = var5 - var17; var21 <= var5 + var17; ++var21)
                {
                    int var22 = (var20 - var7 + 16) * 32 + var21 - var5 + 16;
                    float var23 = this.field_175076_N[var22] * 0.5F;
                    float var24 = this.field_175077_O[var22] * 0.5F;
                    BlockPos var25 = new BlockPos(var21, 0, var20);
                    BiomeGenBase var26 = var4.getBiomeGenForCoords(var25);

                    if (var26.canSpawnLightningBolt() || var26.getEnableSnow())
                    {
                        int var27 = var4.func_175725_q(var25).getY();
                        int var28 = var6 - var17;
                        int var29 = var6 + var17;

                        if (var28 < var27)
                        {
                            var28 = var27;
                        }

                        if (var29 < var27)
                        {
                            var29 = var27;
                        }

                        float var30 = 1.0F;
                        int var31 = var27;

                        if (var27 < var16)
                        {
                            var31 = var16;
                        }

                        if (var28 != var29)
                        {
                            this.random.setSeed((long)(var21 * var21 * 3121 + var21 * 45238971 ^ var20 * var20 * 418711 + var20 * 13761));
                            float var32 = var26.func_180626_a(new BlockPos(var21, var28, var20));
                            float var33;
                            double var36;

                            if (var4.getWorldChunkManager().getTemperatureAtHeight(var32, var27) >= 0.15F)
                            {
                                if (var18 != 0)
                                {
                                    if (var18 >= 0)
                                    {
                                        var8.draw();
                                    }

                                    var18 = 0;
                                    this.mc.getTextureManager().bindTexture(locationRainPng);
                                    var9.startDrawingQuads();
                                }

                                var33 = ((float)(this.rendererUpdateCount + var21 * var21 * 3121 + var21 * 45238971 + var20 * var20 * 418711 + var20 * 13761 & 31) + p_78474_1_) / 32.0F * (3.0F + this.random.nextFloat());
                                double var34 = (double)((float)var21 + 0.5F) - var3.posX;
                                var36 = (double)((float)var20 + 0.5F) - var3.posZ;
                                float var38 = MathHelper.sqrt_double(var34 * var34 + var36 * var36) / (float)var17;
                                float var39 = 1.0F;
                                var9.func_178963_b(var4.getCombinedLight(new BlockPos(var21, var31, var20), 0));
                                var9.func_178960_a(var39, var39, var39, ((1.0F - var38 * var38) * 0.5F + 0.5F) * var2);
                                var9.setTranslation(-var10 * 1.0D, -var12 * 1.0D, -var14 * 1.0D);
                                var9.addVertexWithUV((double)((float)var21 - var23) + 0.5D, (double)var28, (double)((float)var20 - var24) + 0.5D, (double)(0.0F * var30), (double)((float)var28 * var30 / 4.0F + var33 * var30));
                                var9.addVertexWithUV((double)((float)var21 + var23) + 0.5D, (double)var28, (double)((float)var20 + var24) + 0.5D, (double)(1.0F * var30), (double)((float)var28 * var30 / 4.0F + var33 * var30));
                                var9.addVertexWithUV((double)((float)var21 + var23) + 0.5D, (double)var29, (double)((float)var20 + var24) + 0.5D, (double)(1.0F * var30), (double)((float)var29 * var30 / 4.0F + var33 * var30));
                                var9.addVertexWithUV((double)((float)var21 - var23) + 0.5D, (double)var29, (double)((float)var20 - var24) + 0.5D, (double)(0.0F * var30), (double)((float)var29 * var30 / 4.0F + var33 * var30));
                                var9.setTranslation(0.0D, 0.0D, 0.0D);
                            }
                            else
                            {
                                if (var18 != 1)
                                {
                                    if (var18 >= 0)
                                    {
                                        var8.draw();
                                    }

                                    var18 = 1;
                                    this.mc.getTextureManager().bindTexture(locationSnowPng);
                                    var9.startDrawingQuads();
                                }

                                var33 = ((float)(this.rendererUpdateCount & 511) + p_78474_1_) / 512.0F;
                                float var42 = this.random.nextFloat() + var19 * 0.01F * (float)this.random.nextGaussian();
                                float var35 = this.random.nextFloat() + var19 * (float)this.random.nextGaussian() * 0.001F;
                                var36 = (double)((float)var21 + 0.5F) - var3.posX;
                                double var43 = (double)((float)var20 + 0.5F) - var3.posZ;
                                float var40 = MathHelper.sqrt_double(var36 * var36 + var43 * var43) / (float)var17;
                                float var41 = 1.0F;
                                var9.func_178963_b((var4.getCombinedLight(new BlockPos(var21, var31, var20), 0) * 3 + 15728880) / 4);
                                var9.func_178960_a(var41, var41, var41, ((1.0F - var40 * var40) * 0.3F + 0.5F) * var2);
                                var9.setTranslation(-var10 * 1.0D, -var12 * 1.0D, -var14 * 1.0D);
                                var9.addVertexWithUV((double)((float)var21 - var23) + 0.5D, (double)var28, (double)((float)var20 - var24) + 0.5D, (double)(0.0F * var30 + var42), (double)((float)var28 * var30 / 4.0F + var33 * var30 + var35));
                                var9.addVertexWithUV((double)((float)var21 + var23) + 0.5D, (double)var28, (double)((float)var20 + var24) + 0.5D, (double)(1.0F * var30 + var42), (double)((float)var28 * var30 / 4.0F + var33 * var30 + var35));
                                var9.addVertexWithUV((double)((float)var21 + var23) + 0.5D, (double)var29, (double)((float)var20 + var24) + 0.5D, (double)(1.0F * var30 + var42), (double)((float)var29 * var30 / 4.0F + var33 * var30 + var35));
                                var9.addVertexWithUV((double)((float)var21 - var23) + 0.5D, (double)var29, (double)((float)var20 - var24) + 0.5D, (double)(0.0F * var30 + var42), (double)((float)var29 * var30 / 4.0F + var33 * var30 + var35));
                                var9.setTranslation(0.0D, 0.0D, 0.0D);
                            }
                        }
                    }
                }
            }

            if (var18 >= 0)
            {
                var8.draw();
            }

            GlStateManager.enableCull();
            GlStateManager.disableBlend();
            GlStateManager.alphaFunc(516, 0.1F);
            this.func_175072_h();
        }
    }

    /**
     * Setup orthogonal projection for rendering GUI screen overlays
     */
    public void setupOverlayRendering()
    {
        ScaledResolution var1 = new ScaledResolution(this.mc, this.mc.displayWidth, this.mc.displayHeight);
        GlStateManager.clear(256);
        GlStateManager.matrixMode(5889);
        GlStateManager.loadIdentity();
        GlStateManager.ortho(0.0D, var1.getScaledWidth_double(), var1.getScaledHeight_double(), 0.0D, 1000.0D, 3000.0D);
        GlStateManager.matrixMode(5888);
        GlStateManager.loadIdentity();
        GlStateManager.translate(0.0F, 0.0F, -2000.0F);
    }

    /**
     * calculates fog and calls glClearColor
     */
    private void updateFogColor(float p_78466_1_)
    {
        WorldClient var2 = this.mc.theWorld;
        Entity var3 = this.mc.func_175606_aa();
        float var4 = 0.25F + 0.75F * (float)this.mc.gameSettings.renderDistanceChunks / 32.0F;
        var4 = 1.0F - (float)Math.pow((double)var4, 0.25D);
        Vec3 var5 = var2.getSkyColor(this.mc.func_175606_aa(), p_78466_1_);
        float var6 = (float)var5.xCoord;
        float var7 = (float)var5.yCoord;
        float var8 = (float)var5.zCoord;
        Vec3 var9 = var2.getFogColor(p_78466_1_);
        this.field_175080_Q = (float)var9.xCoord;
        this.field_175082_R = (float)var9.yCoord;
        this.field_175081_S = (float)var9.zCoord;
        float var13;

        if (this.mc.gameSettings.renderDistanceChunks >= 4)
        {
            double var10 = -1.0D;
            Vec3 var12 = MathHelper.sin(var2.getCelestialAngleRadians(p_78466_1_)) > 0.0F ? new Vec3(var10, 0.0D, 0.0D) : new Vec3(1.0D, 0.0D, 0.0D);
            var13 = (float)var3.getLook(p_78466_1_).dotProduct(var12);

            if (var13 < 0.0F)
            {
                var13 = 0.0F;
            }

            if (var13 > 0.0F)
            {
                float[] var14 = var2.provider.calcSunriseSunsetColors(var2.getCelestialAngle(p_78466_1_), p_78466_1_);

                if (var14 != null)
                {
                    var13 *= var14[3];
                    this.field_175080_Q = this.field_175080_Q * (1.0F - var13) + var14[0] * var13;
                    this.field_175082_R = this.field_175082_R * (1.0F - var13) + var14[1] * var13;
                    this.field_175081_S = this.field_175081_S * (1.0F - var13) + var14[2] * var13;
                }
            }
        }

        this.field_175080_Q += (var6 - this.field_175080_Q) * var4;
        this.field_175082_R += (var7 - this.field_175082_R) * var4;
        this.field_175081_S += (var8 - this.field_175081_S) * var4;
        float var19 = var2.getRainStrength(p_78466_1_);
        float var11;
        float var20;

        if (var19 > 0.0F)
        {
            var11 = 1.0F - var19 * 0.5F;
            var20 = 1.0F - var19 * 0.4F;
            this.field_175080_Q *= var11;
            this.field_175082_R *= var11;
            this.field_175081_S *= var20;
        }

        var11 = var2.getWeightedThunderStrength(p_78466_1_);

        if (var11 > 0.0F)
        {
            var20 = 1.0F - var11 * 0.5F;
            this.field_175080_Q *= var20;
            this.field_175082_R *= var20;
            this.field_175081_S *= var20;
        }

        Block var21 = ActiveRenderInfo.func_180786_a(this.mc.theWorld, var3, p_78466_1_);

        if (this.cloudFog)
        {
            Vec3 var22 = var2.getCloudColour(p_78466_1_);
            this.field_175080_Q = (float)var22.xCoord;
            this.field_175082_R = (float)var22.yCoord;
            this.field_175081_S = (float)var22.zCoord;
        }
        else if (var21.getMaterial() == Material.water)
        {
            var13 = (float)EnchantmentHelper.func_180319_a(var3) * 0.2F;

            if (var3 instanceof EntityLivingBase && ((EntityLivingBase)var3).isPotionActive(Potion.waterBreathing))
            {
                var13 = var13 * 0.3F + 0.6F;
            }

            this.field_175080_Q = 0.02F + var13;
            this.field_175082_R = 0.02F + var13;
            this.field_175081_S = 0.2F + var13;
        }
        else if (var21.getMaterial() == Material.lava)
        {
            this.field_175080_Q = 0.6F;
            this.field_175082_R = 0.1F;
            this.field_175081_S = 0.0F;
        }

        var13 = this.fogColor2 + (this.fogColor1 - this.fogColor2) * p_78466_1_;
        this.field_175080_Q *= var13;
        this.field_175082_R *= var13;
        this.field_175081_S *= var13;
        double var23 = (var3.lastTickPosY + (var3.posY - var3.lastTickPosY) * (double)p_78466_1_) * var2.provider.getVoidFogYFactor();

        if (var3 instanceof EntityLivingBase && ((EntityLivingBase)var3).isPotionActive(Potion.blindness))
        {
            int var16 = ((EntityLivingBase)var3).getActivePotionEffect(Potion.blindness).getDuration();

            if (var16 < 20)
            {
                var23 *= (double)(1.0F - (float)var16 / 20.0F);
            }
            else
            {
                var23 = 0.0D;
            }
        }

        if (var23 < 1.0D)
        {
            if (var23 < 0.0D)
            {
                var23 = 0.0D;
            }

            var23 *= var23;
            this.field_175080_Q = (float)((double)this.field_175080_Q * var23);
            this.field_175082_R = (float)((double)this.field_175082_R * var23);
            this.field_175081_S = (float)((double)this.field_175081_S * var23);
        }

        float var24;

        if (this.bossColorModifier > 0.0F)
        {
            var24 = this.bossColorModifierPrev + (this.bossColorModifier - this.bossColorModifierPrev) * p_78466_1_;
            this.field_175080_Q = this.field_175080_Q * (1.0F - var24) + this.field_175080_Q * 0.7F * var24;
            this.field_175082_R = this.field_175082_R * (1.0F - var24) + this.field_175082_R * 0.6F * var24;
            this.field_175081_S = this.field_175081_S * (1.0F - var24) + this.field_175081_S * 0.6F * var24;
        }

        float var17;

        if (var3 instanceof EntityLivingBase && ((EntityLivingBase)var3).isPotionActive(Potion.nightVision))
        {
            var24 = this.func_180438_a((EntityLivingBase)var3, p_78466_1_);
            var17 = 1.0F / this.field_175080_Q;

            if (var17 > 1.0F / this.field_175082_R)
            {
                var17 = 1.0F / this.field_175082_R;
            }

            if (var17 > 1.0F / this.field_175081_S)
            {
                var17 = 1.0F / this.field_175081_S;
            }

            this.field_175080_Q = this.field_175080_Q * (1.0F - var24) + this.field_175080_Q * var17 * var24;
            this.field_175082_R = this.field_175082_R * (1.0F - var24) + this.field_175082_R * var17 * var24;
            this.field_175081_S = this.field_175081_S * (1.0F - var24) + this.field_175081_S * var17 * var24;
        }

        if (this.mc.gameSettings.anaglyph)
        {
            var24 = (this.field_175080_Q * 30.0F + this.field_175082_R * 59.0F + this.field_175081_S * 11.0F) / 100.0F;
            var17 = (this.field_175080_Q * 30.0F + this.field_175082_R * 70.0F) / 100.0F;
            float var18 = (this.field_175080_Q * 30.0F + this.field_175081_S * 70.0F) / 100.0F;
            this.field_175080_Q = var24;
            this.field_175082_R = var17;
            this.field_175081_S = var18;
        }

        GlStateManager.clearColor(this.field_175080_Q, this.field_175082_R, this.field_175081_S, 0.0F);
    }

    /**
     * Sets up the fog to be rendered. If the arg passed in is -1 the fog starts at 0 and goes to 80% of far plane
     * distance and is used for sky rendering.
     */
    private void setupFog(int p_78468_1_, float p_78468_2_)
    {
        Entity var3 = this.mc.func_175606_aa();
        boolean var4 = false;

        if (var3 instanceof EntityPlayer)
        {
            var4 = ((EntityPlayer)var3).capabilities.isCreativeMode;
        }

        GL11.glFog(GL11.GL_FOG_COLOR, this.setFogColorBuffer(this.field_175080_Q, this.field_175082_R, this.field_175081_S, 1.0F));
        GL11.glNormal3f(0.0F, -1.0F, 0.0F);
        GlStateManager.color(1.0F, 1.0F, 1.0F, 1.0F);
        Block var5 = ActiveRenderInfo.func_180786_a(this.mc.theWorld, var3, p_78468_2_);
        float var6;

        if (var3 instanceof EntityLivingBase && ((EntityLivingBase)var3).isPotionActive(Potion.blindness))
        {
            var6 = 5.0F;
            int var7 = ((EntityLivingBase)var3).getActivePotionEffect(Potion.blindness).getDuration();

            if (var7 < 20)
            {
                var6 = 5.0F + (this.farPlaneDistance - 5.0F) * (1.0F - (float)var7 / 20.0F);
            }

            GlStateManager.setFog(9729);

            if (p_78468_1_ == -1)
            {
                GlStateManager.setFogStart(0.0F);
                GlStateManager.setFogEnd(var6 * 0.8F);
            }
            else
            {
                GlStateManager.setFogStart(var6 * 0.25F);
                GlStateManager.setFogEnd(var6);
            }

            if (GLContext.getCapabilities().GL_NV_fog_distance)
            {
                GL11.glFogi(34138, 34139);
            }
        }
        else if (this.cloudFog)
        {
            GlStateManager.setFog(2048);
            GlStateManager.setFogDensity(0.1F);
        }
        else if (var5.getMaterial() == Material.water)
        {
            GlStateManager.setFog(2048);

            if (var3 instanceof EntityLivingBase && ((EntityLivingBase)var3).isPotionActive(Potion.waterBreathing))
            {
                GlStateManager.setFogDensity(0.01F);
            }
            else
            {
                GlStateManager.setFogDensity(0.1F - (float)EnchantmentHelper.func_180319_a(var3) * 0.03F);
            }
        }
        else if (var5.getMaterial() == Material.lava)
        {
            GlStateManager.setFog(2048);
            GlStateManager.setFogDensity(2.0F);
        }
        else
        {
            var6 = this.farPlaneDistance;
            GlStateManager.setFog(9729);

            if (p_78468_1_ == -1)
            {
                GlStateManager.setFogStart(0.0F);
                GlStateManager.setFogEnd(var6);
            }
            else
            {
                GlStateManager.setFogStart(var6 * 0.75F);
                GlStateManager.setFogEnd(var6);
            }

            if (GLContext.getCapabilities().GL_NV_fog_distance)
            {
                GL11.glFogi(34138, 34139);
            }

            if (this.mc.theWorld.provider.doesXZShowFog((int)var3.posX, (int)var3.posZ))
            {
                GlStateManager.setFogStart(var6 * 0.05F);
                GlStateManager.setFogEnd(Math.min(var6, 192.0F) * 0.5F);
            }
        }

        GlStateManager.enableColorMaterial();
        GlStateManager.enableFog();
        GlStateManager.colorMaterial(1028, 4608);
    }

    /**
     * Update and return fogColorBuffer with the RGBA values passed as arguments
     */
    private FloatBuffer setFogColorBuffer(float p_78469_1_, float p_78469_2_, float p_78469_3_, float p_78469_4_)
    {
        this.fogColorBuffer.clear();
        this.fogColorBuffer.put(p_78469_1_).put(p_78469_2_).put(p_78469_3_).put(p_78469_4_);
        this.fogColorBuffer.flip();
        return this.fogColorBuffer;
    }

    public MapItemRenderer getMapItemRenderer()
    {
        return this.theMapItemRenderer;
    }
}
