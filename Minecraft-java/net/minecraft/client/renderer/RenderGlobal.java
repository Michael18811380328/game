package net.minecraft.client.renderer;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.google.gson.JsonSyntaxException;
import java.io.IOException;
import java.util.EnumSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.Callable;
import javax.vecmath.Matrix4f;
import javax.vecmath.Vector3d;
import javax.vecmath.Vector3f;
import javax.vecmath.Vector4f;
import net.minecraft.block.Block;
import net.minecraft.block.BlockChest;
import net.minecraft.block.BlockEnderChest;
import net.minecraft.block.BlockSign;
import net.minecraft.block.BlockSkull;
import net.minecraft.block.material.Material;
import net.minecraft.block.state.IBlockState;
import net.minecraft.client.Minecraft;
import net.minecraft.client.audio.ISound;
import net.minecraft.client.audio.PositionedSoundRecord;
import net.minecraft.client.multiplayer.WorldClient;
import net.minecraft.client.particle.EntityFX;
import net.minecraft.client.renderer.chunk.ChunkRenderDispatcher;
import net.minecraft.client.renderer.chunk.CompiledChunk;
import net.minecraft.client.renderer.chunk.IRenderChunkFactory;
import net.minecraft.client.renderer.chunk.ListChunkFactory;
import net.minecraft.client.renderer.chunk.RenderChunk;
import net.minecraft.client.renderer.chunk.VboChunkFactory;
import net.minecraft.client.renderer.chunk.VisGraph;
import net.minecraft.client.renderer.culling.ClippingHelper;
import net.minecraft.client.renderer.culling.ClippingHelperImpl;
import net.minecraft.client.renderer.culling.Frustrum;
import net.minecraft.client.renderer.culling.ICamera;
import net.minecraft.client.renderer.entity.RenderManager;
import net.minecraft.client.renderer.texture.TextureAtlasSprite;
import net.minecraft.client.renderer.texture.TextureManager;
import net.minecraft.client.renderer.texture.TextureMap;
import net.minecraft.client.renderer.tileentity.TileEntityRendererDispatcher;
import net.minecraft.client.renderer.vertex.DefaultVertexFormats;
import net.minecraft.client.renderer.vertex.VertexBuffer;
import net.minecraft.client.renderer.vertex.VertexFormat;
import net.minecraft.client.renderer.vertex.VertexFormatElement;
import net.minecraft.client.resources.IResourceManager;
import net.minecraft.client.resources.IResourceManagerReloadListener;
import net.minecraft.client.shader.Framebuffer;
import net.minecraft.client.shader.ShaderGroup;
import net.minecraft.client.shader.ShaderLinkHelper;
import net.minecraft.crash.CrashReport;
import net.minecraft.crash.CrashReportCategory;
import net.minecraft.entity.Entity;
import net.minecraft.entity.EntityLivingBase;
import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.entity.projectile.EntityWitherSkull;
import net.minecraft.init.Blocks;
import net.minecraft.init.Items;
import net.minecraft.item.Item;
import net.minecraft.item.ItemDye;
import net.minecraft.item.ItemRecord;
import net.minecraft.tileentity.TileEntity;
import net.minecraft.tileentity.TileEntityChest;
import net.minecraft.util.AxisAlignedBB;
import net.minecraft.util.BlockPos;
import net.minecraft.util.EnumFacing;
import net.minecraft.util.EnumParticleTypes;
import net.minecraft.util.EnumWorldBlockLayer;
import net.minecraft.util.MathHelper;
import net.minecraft.util.MovingObjectPosition;
import net.minecraft.util.ReportedException;
import net.minecraft.util.ResourceLocation;
import net.minecraft.util.Vec3;
import net.minecraft.world.IWorldAccess;
import net.minecraft.world.border.WorldBorder;
import net.minecraft.world.chunk.Chunk;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.lwjgl.opengl.GL11;

public class RenderGlobal implements IWorldAccess, IResourceManagerReloadListener
{
    private static final Logger logger = LogManager.getLogger();
    private static final ResourceLocation locationMoonPhasesPng = new ResourceLocation("textures/environment/moon_phases.png");
    private static final ResourceLocation locationSunPng = new ResourceLocation("textures/environment/sun.png");
    private static final ResourceLocation locationCloudsPng = new ResourceLocation("textures/environment/clouds.png");
    private static final ResourceLocation locationEndSkyPng = new ResourceLocation("textures/environment/end_sky.png");
    private static final ResourceLocation field_175006_g = new ResourceLocation("textures/misc/forcefield.png");

    /** A reference to the Minecraft object. */
    private final Minecraft mc;

    /** The RenderEngine instance used by RenderGlobal */
    private final TextureManager renderEngine;
    private final RenderManager field_175010_j;
    private WorldClient theWorld;
    private Set field_175009_l = Sets.newLinkedHashSet();

    /** List of OpenGL lists for the current render pass */
    private List glRenderLists = Lists.newArrayListWithCapacity(69696);
    private ViewFrustum field_175008_n;

    /** The star GL Call list */
    private int starGLCallList = -1;

    /** OpenGL sky list */
    private int glSkyList = -1;

    /** OpenGL sky list 2 */
    private int glSkyList2 = -1;
    private VertexFormat field_175014_r;
    private VertexBuffer field_175013_s;
    private VertexBuffer field_175012_t;
    private VertexBuffer field_175011_u;

    /**
     * counts the cloud render updates. Used with mod to stagger some updates
     */
    private int cloudTickCounter;

    /**
     * Stores blocks currently being broken. Key is entity ID of the thing doing the breaking. Value is a
     * DestroyBlockProgress
     */
    private final Map damagedBlocks = Maps.newHashMap();

    /** Currently playing sounds.  Type:  HashMap<ChunkCoordinates, ISound> */
    private final Map mapSoundPositions = Maps.newHashMap();
    private final TextureAtlasSprite[] destroyBlockIcons = new TextureAtlasSprite[10];
    private Framebuffer field_175015_z;
    private ShaderGroup field_174991_A;
    private double field_174992_B = Double.MIN_VALUE;
    private double field_174993_C = Double.MIN_VALUE;
    private double field_174987_D = Double.MIN_VALUE;
    private int field_174988_E = Integer.MIN_VALUE;
    private int field_174989_F = Integer.MIN_VALUE;
    private int field_174990_G = Integer.MIN_VALUE;
    private double field_174997_H = Double.MIN_VALUE;
    private double field_174998_I = Double.MIN_VALUE;
    private double field_174999_J = Double.MIN_VALUE;
    private double field_175000_K = Double.MIN_VALUE;
    private double field_174994_L = Double.MIN_VALUE;
    private final ChunkRenderDispatcher field_174995_M = new ChunkRenderDispatcher();
    private ChunkRenderContainer field_174996_N;
    private int renderDistanceChunks = -1;

    /** Render entities startup counter (init value=2) */
    private int renderEntitiesStartupCounter = 2;

    /** Count entities total */
    private int countEntitiesTotal;

    /** Count entities rendered */
    private int countEntitiesRendered;

    /** Count entities hidden */
    private int countEntitiesHidden;
    private boolean field_175002_T = false;
    private ClippingHelper field_175001_U;
    private final Vector4f[] field_175004_V = new Vector4f[8];
    private final Vector3d field_175003_W = new Vector3d();
    private boolean field_175005_X = false;
    IRenderChunkFactory field_175007_a;
    private double prevRenderSortX;
    private double prevRenderSortY;
    private double prevRenderSortZ;
    private boolean displayListEntitiesDirty = true;
    private static final String __OBFID = "CL_00000954";

    public RenderGlobal(Minecraft mcIn)
    {
        this.mc = mcIn;
        this.field_175010_j = mcIn.getRenderManager();
        this.renderEngine = mcIn.getTextureManager();
        this.renderEngine.bindTexture(field_175006_g);
        GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_S, GL11.GL_REPEAT);
        GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_T, GL11.GL_REPEAT);
        GlStateManager.func_179144_i(0);
        this.func_174971_n();
        this.field_175005_X = OpenGlHelper.func_176075_f();

        if (this.field_175005_X)
        {
            this.field_174996_N = new VboRenderList();
            this.field_175007_a = new VboChunkFactory();
        }
        else
        {
            this.field_174996_N = new RenderList();
            this.field_175007_a = new ListChunkFactory();
        }

        this.field_175014_r = new VertexFormat();
        this.field_175014_r.func_177349_a(new VertexFormatElement(0, VertexFormatElement.EnumType.FLOAT, VertexFormatElement.EnumUseage.POSITION, 3));
        this.func_174963_q();
        this.func_174980_p();
        this.func_174964_o();
    }

    public void onResourceManagerReload(IResourceManager p_110549_1_)
    {
        this.func_174971_n();
    }

    private void func_174971_n()
    {
        TextureMap var1 = this.mc.getTextureMapBlocks();

        for (int var2 = 0; var2 < this.destroyBlockIcons.length; ++var2)
        {
            this.destroyBlockIcons[var2] = var1.getAtlasSprite("minecraft:blocks/destroy_stage_" + var2);
        }
    }

    public void func_174966_b()
    {
        if (OpenGlHelper.shadersSupported)
        {
            if (ShaderLinkHelper.getStaticShaderLinkHelper() == null)
            {
                ShaderLinkHelper.setNewStaticShaderLinkHelper();
            }

            ResourceLocation var1 = new ResourceLocation("shaders/post/entity_outline.json");

            try
            {
                this.field_174991_A = new ShaderGroup(this.mc.getTextureManager(), this.mc.getResourceManager(), this.mc.getFramebuffer(), var1);
                this.field_174991_A.createBindFramebuffers(this.mc.displayWidth, this.mc.displayHeight);
                this.field_175015_z = this.field_174991_A.func_177066_a("final");
            }
            catch (IOException var3)
            {
                logger.warn("Failed to load shader: " + var1, var3);
                this.field_174991_A = null;
                this.field_175015_z = null;
            }
            catch (JsonSyntaxException var4)
            {
                logger.warn("Failed to load shader: " + var1, var4);
                this.field_174991_A = null;
                this.field_175015_z = null;
            }
        }
        else
        {
            this.field_174991_A = null;
            this.field_175015_z = null;
        }
    }

    public void func_174975_c()
    {
        if (this.func_174985_d())
        {
            GlStateManager.enableBlend();
            GlStateManager.tryBlendFuncSeparate(770, 771, 0, 1);
            this.field_175015_z.func_178038_a(this.mc.displayWidth, this.mc.displayHeight, false);
            GlStateManager.disableBlend();
        }
    }

    protected boolean func_174985_d()
    {
        return this.field_175015_z != null && this.field_174991_A != null && this.mc.thePlayer != null && this.mc.thePlayer.func_175149_v() && this.mc.gameSettings.field_178883_an.getIsKeyPressed();
    }

    private void func_174964_o()
    {
        Tessellator var1 = Tessellator.getInstance();
        WorldRenderer var2 = var1.getWorldRenderer();

        if (this.field_175011_u != null)
        {
            this.field_175011_u.func_177362_c();
        }

        if (this.glSkyList2 >= 0)
        {
            GLAllocation.deleteDisplayLists(this.glSkyList2);
            this.glSkyList2 = -1;
        }

        if (this.field_175005_X)
        {
            this.field_175011_u = new VertexBuffer(this.field_175014_r);
            this.func_174968_a(var2, -16.0F, true);
            var2.draw();
            var2.reset();
            this.field_175011_u.func_177360_a(var2.func_178966_f(), var2.func_178976_e());
        }
        else
        {
            this.glSkyList2 = GLAllocation.generateDisplayLists(1);
            GL11.glNewList(this.glSkyList2, GL11.GL_COMPILE);
            this.func_174968_a(var2, -16.0F, true);
            var1.draw();
            GL11.glEndList();
        }
    }

    private void func_174980_p()
    {
        Tessellator var1 = Tessellator.getInstance();
        WorldRenderer var2 = var1.getWorldRenderer();

        if (this.field_175012_t != null)
        {
            this.field_175012_t.func_177362_c();
        }

        if (this.glSkyList >= 0)
        {
            GLAllocation.deleteDisplayLists(this.glSkyList);
            this.glSkyList = -1;
        }

        if (this.field_175005_X)
        {
            this.field_175012_t = new VertexBuffer(this.field_175014_r);
            this.func_174968_a(var2, 16.0F, false);
            var2.draw();
            var2.reset();
            this.field_175012_t.func_177360_a(var2.func_178966_f(), var2.func_178976_e());
        }
        else
        {
            this.glSkyList = GLAllocation.generateDisplayLists(1);
            GL11.glNewList(this.glSkyList, GL11.GL_COMPILE);
            this.func_174968_a(var2, 16.0F, false);
            var1.draw();
            GL11.glEndList();
        }
    }

    private void func_174968_a(WorldRenderer p_174968_1_, float p_174968_2_, boolean p_174968_3_)
    {
        boolean var4 = true;
        boolean var5 = true;
        p_174968_1_.startDrawingQuads();

        for (int var6 = -384; var6 <= 384; var6 += 64)
        {
            for (int var7 = -384; var7 <= 384; var7 += 64)
            {
                float var8 = (float)var6;
                float var9 = (float)(var6 + 64);

                if (p_174968_3_)
                {
                    var9 = (float)var6;
                    var8 = (float)(var6 + 64);
                }

                p_174968_1_.addVertex((double)var8, (double)p_174968_2_, (double)var7);
                p_174968_1_.addVertex((double)var9, (double)p_174968_2_, (double)var7);
                p_174968_1_.addVertex((double)var9, (double)p_174968_2_, (double)(var7 + 64));
                p_174968_1_.addVertex((double)var8, (double)p_174968_2_, (double)(var7 + 64));
            }
        }
    }

    private void func_174963_q()
    {
        Tessellator var1 = Tessellator.getInstance();
        WorldRenderer var2 = var1.getWorldRenderer();

        if (this.field_175013_s != null)
        {
            this.field_175013_s.func_177362_c();
        }

        if (this.starGLCallList >= 0)
        {
            GLAllocation.deleteDisplayLists(this.starGLCallList);
            this.starGLCallList = -1;
        }

        if (this.field_175005_X)
        {
            this.field_175013_s = new VertexBuffer(this.field_175014_r);
            this.func_180444_a(var2);
            var2.draw();
            var2.reset();
            this.field_175013_s.func_177360_a(var2.func_178966_f(), var2.func_178976_e());
        }
        else
        {
            this.starGLCallList = GLAllocation.generateDisplayLists(1);
            GlStateManager.pushMatrix();
            GL11.glNewList(this.starGLCallList, GL11.GL_COMPILE);
            this.func_180444_a(var2);
            var1.draw();
            GL11.glEndList();
            GlStateManager.popMatrix();
        }
    }

    private void func_180444_a(WorldRenderer p_180444_1_)
    {
        Random var2 = new Random(10842L);
        p_180444_1_.startDrawingQuads();

        for (int var3 = 0; var3 < 1500; ++var3)
        {
            double var4 = (double)(var2.nextFloat() * 2.0F - 1.0F);
            double var6 = (double)(var2.nextFloat() * 2.0F - 1.0F);
            double var8 = (double)(var2.nextFloat() * 2.0F - 1.0F);
            double var10 = (double)(0.15F + var2.nextFloat() * 0.1F);
            double var12 = var4 * var4 + var6 * var6 + var8 * var8;

            if (var12 < 1.0D && var12 > 0.01D)
            {
                var12 = 1.0D / Math.sqrt(var12);
                var4 *= var12;
                var6 *= var12;
                var8 *= var12;
                double var14 = var4 * 100.0D;
                double var16 = var6 * 100.0D;
                double var18 = var8 * 100.0D;
                double var20 = Math.atan2(var4, var8);
                double var22 = Math.sin(var20);
                double var24 = Math.cos(var20);
                double var26 = Math.atan2(Math.sqrt(var4 * var4 + var8 * var8), var6);
                double var28 = Math.sin(var26);
                double var30 = Math.cos(var26);
                double var32 = var2.nextDouble() * Math.PI * 2.0D;
                double var34 = Math.sin(var32);
                double var36 = Math.cos(var32);

                for (int var38 = 0; var38 < 4; ++var38)
                {
                    double var39 = 0.0D;
                    double var41 = (double)((var38 & 2) - 1) * var10;
                    double var43 = (double)((var38 + 1 & 2) - 1) * var10;
                    double var45 = 0.0D;
                    double var47 = var41 * var36 - var43 * var34;
                    double var49 = var43 * var36 + var41 * var34;
                    double var53 = var47 * var28 + 0.0D * var30;
                    double var55 = 0.0D * var28 - var47 * var30;
                    double var57 = var55 * var22 - var49 * var24;
                    double var61 = var49 * var22 + var55 * var24;
                    p_180444_1_.addVertex(var14 + var57, var16 + var53, var18 + var61);
                }
            }
        }
    }

    /**
     * set null to clear
     */
    public void setWorldAndLoadRenderers(WorldClient p_72732_1_)
    {
        if (this.theWorld != null)
        {
            this.theWorld.removeWorldAccess(this);
        }

        this.field_174992_B = Double.MIN_VALUE;
        this.field_174993_C = Double.MIN_VALUE;
        this.field_174987_D = Double.MIN_VALUE;
        this.field_174988_E = Integer.MIN_VALUE;
        this.field_174989_F = Integer.MIN_VALUE;
        this.field_174990_G = Integer.MIN_VALUE;
        this.field_175010_j.set(p_72732_1_);
        this.theWorld = p_72732_1_;

        if (p_72732_1_ != null)
        {
            p_72732_1_.addWorldAccess(this);
            this.loadRenderers();
        }
    }

    /**
     * Loads all the renderers and sets up the basic settings usage
     */
    public void loadRenderers()
    {
        if (this.theWorld != null)
        {
            this.displayListEntitiesDirty = true;
            Blocks.leaves.setGraphicsLevel(this.mc.gameSettings.fancyGraphics);
            Blocks.leaves2.setGraphicsLevel(this.mc.gameSettings.fancyGraphics);
            this.renderDistanceChunks = this.mc.gameSettings.renderDistanceChunks;
            boolean var1 = this.field_175005_X;
            this.field_175005_X = OpenGlHelper.func_176075_f();

            if (var1 && !this.field_175005_X)
            {
                this.field_174996_N = new RenderList();
                this.field_175007_a = new ListChunkFactory();
            }
            else if (!var1 && this.field_175005_X)
            {
                this.field_174996_N = new VboRenderList();
                this.field_175007_a = new VboChunkFactory();
            }

            if (var1 != this.field_175005_X)
            {
                this.func_174963_q();
                this.func_174980_p();
                this.func_174964_o();
            }

            if (this.field_175008_n != null)
            {
                this.field_175008_n.func_178160_a();
            }

            this.func_174986_e();
            this.field_175008_n = new ViewFrustum(this.theWorld, this.mc.gameSettings.renderDistanceChunks, this, this.field_175007_a);

            if (this.theWorld != null)
            {
                Entity var2 = this.mc.func_175606_aa();

                if (var2 != null)
                {
                    this.field_175008_n.func_178163_a(var2.posX, var2.posZ);
                }
            }

            this.renderEntitiesStartupCounter = 2;
        }
    }

    protected void func_174986_e()
    {
        this.field_175009_l.clear();
        this.field_174995_M.func_178514_b();
    }

    public void checkOcclusionQueryResult(int p_72720_1_, int p_72720_2_)
    {
        if (OpenGlHelper.shadersSupported)
        {
            if (this.field_174991_A != null)
            {
                this.field_174991_A.createBindFramebuffers(p_72720_1_, p_72720_2_);
            }
        }
    }

    public void func_180446_a(Entity p_180446_1_, ICamera p_180446_2_, float p_180446_3_)
    {
        if (this.renderEntitiesStartupCounter > 0)
        {
            --this.renderEntitiesStartupCounter;
        }
        else
        {
            double var4 = p_180446_1_.prevPosX + (p_180446_1_.posX - p_180446_1_.prevPosX) * (double)p_180446_3_;
            double var6 = p_180446_1_.prevPosY + (p_180446_1_.posY - p_180446_1_.prevPosY) * (double)p_180446_3_;
            double var8 = p_180446_1_.prevPosZ + (p_180446_1_.posZ - p_180446_1_.prevPosZ) * (double)p_180446_3_;
            this.theWorld.theProfiler.startSection("prepare");
            TileEntityRendererDispatcher.instance.func_178470_a(this.theWorld, this.mc.getTextureManager(), this.mc.fontRendererObj, this.mc.func_175606_aa(), p_180446_3_);
            this.field_175010_j.func_180597_a(this.theWorld, this.mc.fontRendererObj, this.mc.func_175606_aa(), this.mc.pointedEntity, this.mc.gameSettings, p_180446_3_);
            this.countEntitiesTotal = 0;
            this.countEntitiesRendered = 0;
            this.countEntitiesHidden = 0;
            Entity var10 = this.mc.func_175606_aa();
            double var11 = var10.lastTickPosX + (var10.posX - var10.lastTickPosX) * (double)p_180446_3_;
            double var13 = var10.lastTickPosY + (var10.posY - var10.lastTickPosY) * (double)p_180446_3_;
            double var15 = var10.lastTickPosZ + (var10.posZ - var10.lastTickPosZ) * (double)p_180446_3_;
            TileEntityRendererDispatcher.staticPlayerX = var11;
            TileEntityRendererDispatcher.staticPlayerY = var13;
            TileEntityRendererDispatcher.staticPlayerZ = var15;
            this.field_175010_j.func_178628_a(var11, var13, var15);
            this.mc.entityRenderer.func_180436_i();
            this.theWorld.theProfiler.endStartSection("global");
            List var17 = this.theWorld.getLoadedEntityList();
            this.countEntitiesTotal = var17.size();
            int var18;
            Entity var19;

            for (var18 = 0; var18 < this.theWorld.weatherEffects.size(); ++var18)
            {
                var19 = (Entity)this.theWorld.weatherEffects.get(var18);
                ++this.countEntitiesRendered;

                if (var19.isInRangeToRender3d(var4, var6, var8))
                {
                    this.field_175010_j.renderEntitySimple(var19, p_180446_3_);
                }
            }

            if (this.func_174985_d())
            {
                GlStateManager.depthFunc(519);
                GlStateManager.disableFog();
                this.field_175015_z.framebufferClear();
                this.field_175015_z.bindFramebuffer(false);
                this.theWorld.theProfiler.endStartSection("entityOutlines");
                RenderHelper.disableStandardItemLighting();
                this.field_175010_j.func_178632_c(true);

                for (var18 = 0; var18 < var17.size(); ++var18)
                {
                    var19 = (Entity)var17.get(var18);
                    boolean var20 = this.mc.func_175606_aa() instanceof EntityLivingBase && ((EntityLivingBase)this.mc.func_175606_aa()).isPlayerSleeping();
                    boolean var21 = var19.isInRangeToRender3d(var4, var6, var8) && (var19.ignoreFrustumCheck || p_180446_2_.isBoundingBoxInFrustum(var19.getEntityBoundingBox()) || var19.riddenByEntity == this.mc.thePlayer) && var19 instanceof EntityPlayer;

                    if ((var19 != this.mc.func_175606_aa() || this.mc.gameSettings.thirdPersonView != 0 || var20) && var21)
                    {
                        this.field_175010_j.renderEntitySimple(var19, p_180446_3_);
                    }
                }

                this.field_175010_j.func_178632_c(false);
                RenderHelper.enableStandardItemLighting();
                GlStateManager.depthMask(false);
                this.field_174991_A.loadShaderGroup(p_180446_3_);
                GlStateManager.depthMask(true);
                this.mc.getFramebuffer().bindFramebuffer(false);
                GlStateManager.enableFog();
                GlStateManager.depthFunc(515);
                GlStateManager.enableDepth();
                GlStateManager.enableAlpha();
            }

            this.theWorld.theProfiler.endStartSection("entities");
            Iterator var25 = this.glRenderLists.iterator();
            RenderGlobal.ContainerLocalRenderInformation var26;

            while (var25.hasNext())
            {
                var26 = (RenderGlobal.ContainerLocalRenderInformation)var25.next();
                Chunk var28 = this.theWorld.getChunkFromBlockCoords(var26.field_178036_a.func_178568_j());
                Iterator var31 = var28.getEntityLists()[var26.field_178036_a.func_178568_j().getY() / 16].iterator();

                while (var31.hasNext())
                {
                    Entity var22 = (Entity)var31.next();
                    boolean var23 = this.field_175010_j.func_178635_a(var22, p_180446_2_, var4, var6, var8) || var22.riddenByEntity == this.mc.thePlayer;

                    if (var23)
                    {
                        boolean var24 = this.mc.func_175606_aa() instanceof EntityLivingBase ? ((EntityLivingBase)this.mc.func_175606_aa()).isPlayerSleeping() : false;

                        if (var22 == this.mc.func_175606_aa() && this.mc.gameSettings.thirdPersonView == 0 && !var24 || var22.posY >= 0.0D && var22.posY < 256.0D && !this.theWorld.isBlockLoaded(new BlockPos(var22)))
                        {
                            continue;
                        }

                        ++this.countEntitiesRendered;
                        this.field_175010_j.renderEntitySimple(var22, p_180446_3_);
                    }

                    if (!var23 && var22 instanceof EntityWitherSkull)
                    {
                        this.mc.getRenderManager().func_178630_b(var22, p_180446_3_);
                    }
                }
            }

            this.theWorld.theProfiler.endStartSection("blockentities");
            RenderHelper.enableStandardItemLighting();
            var25 = this.glRenderLists.iterator();
            TileEntity var32;

            while (var25.hasNext())
            {
                var26 = (RenderGlobal.ContainerLocalRenderInformation)var25.next();
                Iterator var29 = var26.field_178036_a.func_178571_g().func_178485_b().iterator();

                while (var29.hasNext())
                {
                    var32 = (TileEntity)var29.next();
                    TileEntityRendererDispatcher.instance.func_180546_a(var32, p_180446_3_, -1);
                }
            }

            this.func_180443_s();
            var25 = this.damagedBlocks.values().iterator();

            while (var25.hasNext())
            {
                DestroyBlockProgress var27 = (DestroyBlockProgress)var25.next();
                BlockPos var30 = var27.func_180246_b();
                var32 = this.theWorld.getTileEntity(var30);

                if (var32 instanceof TileEntityChest)
                {
                    TileEntityChest var33 = (TileEntityChest)var32;

                    if (var33.adjacentChestXNeg != null)
                    {
                        var30 = var30.offset(EnumFacing.WEST);
                        var32 = this.theWorld.getTileEntity(var30);
                    }
                    else if (var33.adjacentChestZNeg != null)
                    {
                        var30 = var30.offset(EnumFacing.NORTH);
                        var32 = this.theWorld.getTileEntity(var30);
                    }
                }

                Block var34 = this.theWorld.getBlockState(var30).getBlock();

                if (var32 != null && (var34 instanceof BlockChest || var34 instanceof BlockEnderChest || var34 instanceof BlockSign || var34 instanceof BlockSkull))
                {
                    TileEntityRendererDispatcher.instance.func_180546_a(var32, p_180446_3_, var27.getPartialBlockDamage());
                }
            }

            this.func_174969_t();
            this.mc.entityRenderer.func_175072_h();
            this.mc.mcProfiler.endSection();
        }
    }

    /**
     * Gets the render info for use on the Debug screen
     */
    public String getDebugInfoRenders()
    {
        int var1 = this.field_175008_n.field_178164_f.length;
        int var2 = 0;
        Iterator var3 = this.glRenderLists.iterator();

        while (var3.hasNext())
        {
            RenderGlobal.ContainerLocalRenderInformation var4 = (RenderGlobal.ContainerLocalRenderInformation)var3.next();
            CompiledChunk var5 = var4.field_178036_a.field_178590_b;

            if (var5 != CompiledChunk.field_178502_a && !var5.func_178489_a())
            {
                ++var2;
            }
        }

        return String.format("C: %d/%d %sD: %d, %s", new Object[] {Integer.valueOf(var2), Integer.valueOf(var1), this.mc.field_175612_E ? "(s) " : "", Integer.valueOf(this.renderDistanceChunks), this.field_174995_M.func_178504_a()});
    }

    /**
     * Gets the entities info for use on the Debug screen
     */
    public String getDebugInfoEntities()
    {
        return "E: " + this.countEntitiesRendered + "/" + this.countEntitiesTotal + ", B: " + this.countEntitiesHidden + ", I: " + (this.countEntitiesTotal - this.countEntitiesHidden - this.countEntitiesRendered);
    }

    public void func_174970_a(Entity p_174970_1_, double p_174970_2_, ICamera p_174970_4_, int p_174970_5_, boolean p_174970_6_)
    {
        if (this.mc.gameSettings.renderDistanceChunks != this.renderDistanceChunks)
        {
            this.loadRenderers();
        }

        this.theWorld.theProfiler.startSection("camera");
        double var7 = p_174970_1_.posX - this.field_174992_B;
        double var9 = p_174970_1_.posY - this.field_174993_C;
        double var11 = p_174970_1_.posZ - this.field_174987_D;

        if (this.field_174988_E != p_174970_1_.chunkCoordX || this.field_174989_F != p_174970_1_.chunkCoordY || this.field_174990_G != p_174970_1_.chunkCoordZ || var7 * var7 + var9 * var9 + var11 * var11 > 16.0D)
        {
            this.field_174992_B = p_174970_1_.posX;
            this.field_174993_C = p_174970_1_.posY;
            this.field_174987_D = p_174970_1_.posZ;
            this.field_174988_E = p_174970_1_.chunkCoordX;
            this.field_174989_F = p_174970_1_.chunkCoordY;
            this.field_174990_G = p_174970_1_.chunkCoordZ;
            this.field_175008_n.func_178163_a(p_174970_1_.posX, p_174970_1_.posZ);
        }

        this.theWorld.theProfiler.endStartSection("renderlistcamera");
        double var13 = p_174970_1_.lastTickPosX + (p_174970_1_.posX - p_174970_1_.lastTickPosX) * p_174970_2_;
        double var15 = p_174970_1_.lastTickPosY + (p_174970_1_.posY - p_174970_1_.lastTickPosY) * p_174970_2_;
        double var17 = p_174970_1_.lastTickPosZ + (p_174970_1_.posZ - p_174970_1_.lastTickPosZ) * p_174970_2_;
        this.field_174996_N.func_178004_a(var13, var15, var17);
        this.theWorld.theProfiler.endStartSection("cull");

        if (this.field_175001_U != null)
        {
            Frustrum var19 = new Frustrum(this.field_175001_U);
            var19.setPosition(this.field_175003_W.x, this.field_175003_W.y, this.field_175003_W.z);
            p_174970_4_ = var19;
        }

        this.mc.mcProfiler.endStartSection("culling");
        BlockPos var35 = new BlockPos(var13, var15 + (double)p_174970_1_.getEyeHeight(), var17);
        RenderChunk var20 = this.field_175008_n.func_178161_a(var35);
        BlockPos var21 = new BlockPos(MathHelper.floor_double(var13) / 16 * 16, MathHelper.floor_double(var15) / 16 * 16, MathHelper.floor_double(var17) / 16 * 16);
        this.displayListEntitiesDirty = this.displayListEntitiesDirty || !this.field_175009_l.isEmpty() || p_174970_1_.posX != this.field_174997_H || p_174970_1_.posY != this.field_174998_I || p_174970_1_.posZ != this.field_174999_J || (double)p_174970_1_.rotationPitch != this.field_175000_K || (double)p_174970_1_.rotationYaw != this.field_174994_L;
        this.field_174997_H = p_174970_1_.posX;
        this.field_174998_I = p_174970_1_.posY;
        this.field_174999_J = p_174970_1_.posZ;
        this.field_175000_K = (double)p_174970_1_.rotationPitch;
        this.field_174994_L = (double)p_174970_1_.rotationYaw;
        boolean var22 = this.field_175001_U != null;
        RenderGlobal.ContainerLocalRenderInformation var39;
        RenderChunk var41;

        if (!var22 && this.displayListEntitiesDirty)
        {
            this.displayListEntitiesDirty = false;
            this.glRenderLists = Lists.newArrayList();
            LinkedList var23 = Lists.newLinkedList();
            boolean var24 = this.mc.field_175612_E;

            if (var20 == null)
            {
                int var25 = var35.getY() > 0 ? 248 : 8;

                for (int var26 = -this.renderDistanceChunks; var26 <= this.renderDistanceChunks; ++var26)
                {
                    for (int var27 = -this.renderDistanceChunks; var27 <= this.renderDistanceChunks; ++var27)
                    {
                        RenderChunk var28 = this.field_175008_n.func_178161_a(new BlockPos((var26 << 4) + 8, var25, (var27 << 4) + 8));

                        if (var28 != null && ((ICamera)p_174970_4_).isBoundingBoxInFrustum(var28.field_178591_c))
                        {
                            var28.func_178577_a(p_174970_5_);
                            var23.add(new RenderGlobal.ContainerLocalRenderInformation(var28, (EnumFacing)null, 0, null));
                        }
                    }
                }
            }
            else
            {
                boolean var38 = false;
                RenderGlobal.ContainerLocalRenderInformation var40 = new RenderGlobal.ContainerLocalRenderInformation(var20, (EnumFacing)null, 0, null);
                Set var42 = this.func_174978_c(var35);

                if (!var42.isEmpty() && var42.size() == 1)
                {
                    Vector3f var44 = this.func_174962_a(p_174970_1_, p_174970_2_);
                    EnumFacing var29 = EnumFacing.func_176737_a(var44.x, var44.y, var44.z).getOpposite();
                    var42.remove(var29);
                }

                if (var42.isEmpty())
                {
                    var38 = true;
                }

                if (var38 && !p_174970_6_)
                {
                    this.glRenderLists.add(var40);
                }
                else
                {
                    if (p_174970_6_ && this.theWorld.getBlockState(var35).getBlock().isOpaqueCube())
                    {
                        var24 = false;
                    }

                    var20.func_178577_a(p_174970_5_);
                    var23.add(var40);
                }
            }

            while (!var23.isEmpty())
            {
                var39 = (RenderGlobal.ContainerLocalRenderInformation)var23.poll();
                var41 = var39.field_178036_a;
                EnumFacing var43 = var39.field_178034_b;
                BlockPos var45 = var41.func_178568_j();
                this.glRenderLists.add(var39);
                EnumFacing[] var46 = EnumFacing.values();
                int var30 = var46.length;

                for (int var31 = 0; var31 < var30; ++var31)
                {
                    EnumFacing var32 = var46[var31];
                    RenderChunk var33 = this.func_174973_a(var35, var45, var32);

                    if ((!var24 || !var39.field_178035_c.contains(var32.getOpposite())) && (!var24 || var43 == null || var41.func_178571_g().func_178495_a(var43.getOpposite(), var32)) && var33 != null && var33.func_178577_a(p_174970_5_) && ((ICamera)p_174970_4_).isBoundingBoxInFrustum(var33.field_178591_c))
                    {
                        RenderGlobal.ContainerLocalRenderInformation var34 = new RenderGlobal.ContainerLocalRenderInformation(var33, var32, var39.field_178032_d + 1, null);
                        var34.field_178035_c.addAll(var39.field_178035_c);
                        var34.field_178035_c.add(var32);
                        var23.add(var34);
                    }
                }
            }
        }

        if (this.field_175002_T)
        {
            this.func_174984_a(var13, var15, var17);
            this.field_175002_T = false;
        }

        this.field_174995_M.func_178513_e();
        Set var36 = this.field_175009_l;
        this.field_175009_l = Sets.newLinkedHashSet();
        Iterator var37 = this.glRenderLists.iterator();

        while (var37.hasNext())
        {
            var39 = (RenderGlobal.ContainerLocalRenderInformation)var37.next();
            var41 = var39.field_178036_a;

            if (var41.func_178569_m() || var41.func_178583_l() || var36.contains(var41))
            {
                this.displayListEntitiesDirty = true;

                if (this.func_174983_a(var21, var39.field_178036_a))
                {
                    this.mc.mcProfiler.startSection("build near");
                    this.field_174995_M.func_178505_b(var41);
                    var41.func_178575_a(false);
                    this.mc.mcProfiler.endSection();
                }
                else
                {
                    this.field_175009_l.add(var41);
                }
            }
        }

        this.field_175009_l.addAll(var36);
        this.mc.mcProfiler.endSection();
    }

    private boolean func_174983_a(BlockPos p_174983_1_, RenderChunk p_174983_2_)
    {
        BlockPos var3 = p_174983_2_.func_178568_j();
        return MathHelper.abs_int(p_174983_1_.getX() - var3.getX()) > 16 ? false : (MathHelper.abs_int(p_174983_1_.getY() - var3.getY()) > 16 ? false : MathHelper.abs_int(p_174983_1_.getZ() - var3.getZ()) <= 16);
    }

    private Set func_174978_c(BlockPos p_174978_1_)
    {
        VisGraph var2 = new VisGraph();
        BlockPos var3 = new BlockPos(p_174978_1_.getX() >> 4 << 4, p_174978_1_.getY() >> 4 << 4, p_174978_1_.getZ() >> 4 << 4);
        Chunk var4 = this.theWorld.getChunkFromBlockCoords(var3);
        Iterator var5 = BlockPos.getAllInBoxMutable(var3, var3.add(15, 15, 15)).iterator();

        while (var5.hasNext())
        {
            BlockPos.MutableBlockPos var6 = (BlockPos.MutableBlockPos)var5.next();

            if (var4.getBlock(var6).isOpaqueCube())
            {
                var2.func_178606_a(var6);
            }
        }
        return var2.func_178609_b(p_174978_1_);
    }

    private RenderChunk func_174973_a(BlockPos p_174973_1_, BlockPos p_174973_2_, EnumFacing p_174973_3_)
    {
        BlockPos var4 = p_174973_2_.offset(p_174973_3_, 16);
        return MathHelper.abs_int(p_174973_1_.getX() - var4.getX()) > this.renderDistanceChunks * 16 ? null : (var4.getY() >= 0 && var4.getY() < 256 ? (MathHelper.abs_int(p_174973_1_.getZ() - var4.getZ()) > this.renderDistanceChunks * 16 ? null : this.field_175008_n.func_178161_a(var4)) : null);
    }

    private void func_174984_a(double p_174984_1_, double p_174984_3_, double p_174984_5_)
    {
        this.field_175001_U = new ClippingHelperImpl();
        ((ClippingHelperImpl)this.field_175001_U).init();
        Matrix4f var7 = new Matrix4f(this.field_175001_U.field_178626_c);
        var7.transpose();
        Matrix4f var8 = new Matrix4f(this.field_175001_U.field_178625_b);
        var8.transpose();
        Matrix4f var9 = new Matrix4f();
        var9.mul(var8, var7);
        var9.invert();
        this.field_175003_W.x = p_174984_1_;
        this.field_175003_W.y = p_174984_3_;
        this.field_175003_W.z = p_174984_5_;
        this.field_175004_V[0] = new Vector4f(-1.0F, -1.0F, -1.0F, 1.0F);
        this.field_175004_V[1] = new Vector4f(1.0F, -1.0F, -1.0F, 1.0F);
        this.field_175004_V[2] = new Vector4f(1.0F, 1.0F, -1.0F, 1.0F);
        this.field_175004_V[3] = new Vector4f(-1.0F, 1.0F, -1.0F, 1.0F);
        this.field_175004_V[4] = new Vector4f(-1.0F, -1.0F, 1.0F, 1.0F);
        this.field_175004_V[5] = new Vector4f(1.0F, -1.0F, 1.0F, 1.0F);
        this.field_175004_V[6] = new Vector4f(1.0F, 1.0F, 1.0F, 1.0F);
        this.field_175004_V[7] = new Vector4f(-1.0F, 1.0F, 1.0F, 1.0F);

        for (int var10 = 0; var10 < 8; ++var10)
        {
            var9.transform(this.field_175004_V[var10]);
            this.field_175004_V[var10].x /= this.field_175004_V[var10].w;
            this.field_175004_V[var10].y /= this.field_175004_V[var10].w;
            this.field_175004_V[var10].z /= this.field_175004_V[var10].w;
            this.field_175004_V[var10].w = 1.0F;
        }
    }

    protected Vector3f func_174962_a(Entity p_174962_1_, double p_174962_2_)
    {
        float var4 = (float)((double)p_174962_1_.prevRotationPitch + (double)(p_174962_1_.rotationPitch - p_174962_1_.prevRotationPitch) * p_174962_2_);
        float var5 = (float)((double)p_174962_1_.prevRotationYaw + (double)(p_174962_1_.rotationYaw - p_174962_1_.prevRotationYaw) * p_174962_2_);

        if (Minecraft.getMinecraft().gameSettings.thirdPersonView == 2)
        {
            var4 += 180.0F;
        }

        float var6 = MathHelper.cos(-var5 * 0.017453292F - (float)Math.PI);
        float var7 = MathHelper.sin(-var5 * 0.017453292F - (float)Math.PI);
        float var8 = -MathHelper.cos(-var4 * 0.017453292F);
        float var9 = MathHelper.sin(-var4 * 0.017453292F);
        return new Vector3f(var7 * var8, var9, var6 * var8);
    }

    public int func_174977_a(EnumWorldBlockLayer p_174977_1_, double p_174977_2_, int p_174977_4_, Entity p_174977_5_)
    {
        RenderHelper.disableStandardItemLighting();

        if (p_174977_1_ == EnumWorldBlockLayer.TRANSLUCENT)
        {
            this.mc.mcProfiler.startSection("translucent_sort");
            double var6 = p_174977_5_.posX - this.prevRenderSortX;
            double var8 = p_174977_5_.posY - this.prevRenderSortY;
            double var10 = p_174977_5_.posZ - this.prevRenderSortZ;

            if (var6 * var6 + var8 * var8 + var10 * var10 > 1.0D)
            {
                this.prevRenderSortX = p_174977_5_.posX;
                this.prevRenderSortY = p_174977_5_.posY;
                this.prevRenderSortZ = p_174977_5_.posZ;
                int var12 = 0;
                Iterator var13 = this.glRenderLists.iterator();

                while (var13.hasNext())
                {
                    RenderGlobal.ContainerLocalRenderInformation var14 = (RenderGlobal.ContainerLocalRenderInformation)var13.next();

                    if (var14.field_178036_a.field_178590_b.func_178492_d(p_174977_1_) && var12++ < 15)
                    {
                        this.field_174995_M.func_178509_c(var14.field_178036_a);
                    }
                }
            }

            this.mc.mcProfiler.endSection();
        }

        this.mc.mcProfiler.startSection("filterempty");
        int var15 = 0;
        boolean var7 = p_174977_1_ == EnumWorldBlockLayer.TRANSLUCENT;
        int var16 = var7 ? this.glRenderLists.size() - 1 : 0;
        int var9 = var7 ? -1 : this.glRenderLists.size();
        int var17 = var7 ? -1 : 1;

        for (int var11 = var16; var11 != var9; var11 += var17)
        {
            RenderChunk var18 = ((RenderGlobal.ContainerLocalRenderInformation)this.glRenderLists.get(var11)).field_178036_a;

            if (!var18.func_178571_g().func_178491_b(p_174977_1_))
            {
                ++var15;
                this.field_174996_N.func_178002_a(var18, p_174977_1_);
            }
        }

        this.mc.mcProfiler.endStartSection("render_" + p_174977_1_);
        this.func_174982_a(p_174977_1_);
        this.mc.mcProfiler.endSection();
        return var15;
    }

    private void func_174982_a(EnumWorldBlockLayer p_174982_1_)
    {
        this.mc.entityRenderer.func_180436_i();

        if (OpenGlHelper.func_176075_f())
        {
            GL11.glEnableClientState(GL11.GL_VERTEX_ARRAY);
            OpenGlHelper.setClientActiveTexture(OpenGlHelper.defaultTexUnit);
            GL11.glEnableClientState(GL11.GL_TEXTURE_COORD_ARRAY);
            OpenGlHelper.setClientActiveTexture(OpenGlHelper.lightmapTexUnit);
            GL11.glEnableClientState(GL11.GL_TEXTURE_COORD_ARRAY);
            OpenGlHelper.setClientActiveTexture(OpenGlHelper.defaultTexUnit);
            GL11.glEnableClientState(GL11.GL_COLOR_ARRAY);
        }

        this.field_174996_N.func_178001_a(p_174982_1_);

        if (OpenGlHelper.func_176075_f())
        {
            List var2 = DefaultVertexFormats.field_176600_a.func_177343_g();
            Iterator var3 = var2.iterator();

            while (var3.hasNext())
            {
                VertexFormatElement var4 = (VertexFormatElement)var3.next();
                VertexFormatElement.EnumUseage var5 = var4.func_177375_c();
                int var6 = var4.func_177369_e();

                switch (RenderGlobal.SwitchEnumUseage.field_178037_a[var5.ordinal()])
                {
                    case 1:
                        GL11.glDisableClientState(GL11.GL_VERTEX_ARRAY);
                        break;

                    case 2:
                        OpenGlHelper.setClientActiveTexture(OpenGlHelper.defaultTexUnit + var6);
                        GL11.glDisableClientState(GL11.GL_TEXTURE_COORD_ARRAY);
                        OpenGlHelper.setClientActiveTexture(OpenGlHelper.defaultTexUnit);
                        break;

                    case 3:
                        GL11.glDisableClientState(GL11.GL_COLOR_ARRAY);
                        GlStateManager.func_179117_G();
                }
            }
        }

        this.mc.entityRenderer.func_175072_h();
    }

    private void func_174965_a(Iterator p_174965_1_)
    {
        while (p_174965_1_.hasNext())
        {
            DestroyBlockProgress var2 = (DestroyBlockProgress)p_174965_1_.next();
            int var3 = var2.getCreationCloudUpdateTick();

            if (this.cloudTickCounter - var3 > 400)
            {
                p_174965_1_.remove();
            }
        }
    }

    public void updateClouds()
    {
        ++this.cloudTickCounter;

        if (this.cloudTickCounter % 20 == 0)
        {
            this.func_174965_a(this.damagedBlocks.values().iterator());
        }
    }

    private void func_180448_r()
    {
        GlStateManager.disableFog();
        GlStateManager.disableAlpha();
        GlStateManager.enableBlend();
        GlStateManager.tryBlendFuncSeparate(770, 771, 1, 0);
        RenderHelper.disableStandardItemLighting();
        GlStateManager.depthMask(false);
        this.renderEngine.bindTexture(locationEndSkyPng);
        Tessellator var1 = Tessellator.getInstance();
        WorldRenderer var2 = var1.getWorldRenderer();

        for (int var3 = 0; var3 < 6; ++var3)
        {
            GlStateManager.pushMatrix();

            if (var3 == 1)
            {
                GlStateManager.rotate(90.0F, 1.0F, 0.0F, 0.0F);
            }

            if (var3 == 2)
            {
                GlStateManager.rotate(-90.0F, 1.0F, 0.0F, 0.0F);
            }

            if (var3 == 3)
            {
                GlStateManager.rotate(180.0F, 1.0F, 0.0F, 0.0F);
            }

            if (var3 == 4)
            {
                GlStateManager.rotate(90.0F, 0.0F, 0.0F, 1.0F);
            }

            if (var3 == 5)
            {
                GlStateManager.rotate(-90.0F, 0.0F, 0.0F, 1.0F);
            }

            var2.startDrawingQuads();
            var2.func_178991_c(2631720);
            var2.addVertexWithUV(-100.0D, -100.0D, -100.0D, 0.0D, 0.0D);
            var2.addVertexWithUV(-100.0D, -100.0D, 100.0D, 0.0D, 16.0D);
            var2.addVertexWithUV(100.0D, -100.0D, 100.0D, 16.0D, 16.0D);
            var2.addVertexWithUV(100.0D, -100.0D, -100.0D, 16.0D, 0.0D);
            var1.draw();
            GlStateManager.popMatrix();
        }

        GlStateManager.depthMask(true);
        GlStateManager.func_179098_w();
        GlStateManager.enableAlpha();
    }

    public void func_174976_a(float p_174976_1_, int p_174976_2_)
    {
        if (this.mc.theWorld.provider.getDimensionId() == 1)
        {
            this.func_180448_r();
        }
        else if (this.mc.theWorld.provider.isSurfaceWorld())
        {
            GlStateManager.func_179090_x();
            Vec3 var3 = this.theWorld.getSkyColor(this.mc.func_175606_aa(), p_174976_1_);
            float var4 = (float)var3.xCoord;
            float var5 = (float)var3.yCoord;
            float var6 = (float)var3.zCoord;

            if (p_174976_2_ != 2)
            {
                float var7 = (var4 * 30.0F + var5 * 59.0F + var6 * 11.0F) / 100.0F;
                float var8 = (var4 * 30.0F + var5 * 70.0F) / 100.0F;
                float var9 = (var4 * 30.0F + var6 * 70.0F) / 100.0F;
                var4 = var7;
                var5 = var8;
                var6 = var9;
            }

            GlStateManager.color(var4, var5, var6);
            Tessellator var23 = Tessellator.getInstance();
            WorldRenderer var24 = var23.getWorldRenderer();
            GlStateManager.depthMask(false);
            GlStateManager.enableFog();
            GlStateManager.color(var4, var5, var6);

            if (this.field_175005_X)
            {
                this.field_175012_t.func_177359_a();
                GL11.glEnableClientState(GL11.GL_VERTEX_ARRAY);
                GL11.glVertexPointer(3, GL11.GL_FLOAT, 12, 0L);
                this.field_175012_t.func_177358_a(7);
                this.field_175012_t.func_177361_b();
                GL11.glDisableClientState(GL11.GL_VERTEX_ARRAY);
            }
            else
            {
                GlStateManager.callList(this.glSkyList);
            }

            GlStateManager.disableFog();
            GlStateManager.disableAlpha();
            GlStateManager.enableBlend();
            GlStateManager.tryBlendFuncSeparate(770, 771, 1, 0);
            RenderHelper.disableStandardItemLighting();
            float[] var25 = this.theWorld.provider.calcSunriseSunsetColors(this.theWorld.getCelestialAngle(p_174976_1_), p_174976_1_);
            float var10;
            float var11;
            float var12;
            float var13;
            float var14;

            if (var25 != null)
            {
                GlStateManager.func_179090_x();
                GlStateManager.shadeModel(7425);
                GlStateManager.pushMatrix();
                GlStateManager.rotate(90.0F, 1.0F, 0.0F, 0.0F);
                GlStateManager.rotate(MathHelper.sin(this.theWorld.getCelestialAngleRadians(p_174976_1_)) < 0.0F ? 180.0F : 0.0F, 0.0F, 0.0F, 1.0F);
                GlStateManager.rotate(90.0F, 0.0F, 0.0F, 1.0F);
                var10 = var25[0];
                var11 = var25[1];
                var12 = var25[2];
                float var15;

                if (p_174976_2_ != 2)
                {
                    var13 = (var10 * 30.0F + var11 * 59.0F + var12 * 11.0F) / 100.0F;
                    var14 = (var10 * 30.0F + var11 * 70.0F) / 100.0F;
                    var15 = (var10 * 30.0F + var12 * 70.0F) / 100.0F;
                    var10 = var13;
                    var11 = var14;
                    var12 = var15;
                }

                var24.startDrawing(6);
                var24.func_178960_a(var10, var11, var12, var25[3]);
                var24.addVertex(0.0D, 100.0D, 0.0D);
                boolean var27 = true;
                var24.func_178960_a(var25[0], var25[1], var25[2], 0.0F);

                for (int var28 = 0; var28 <= 16; ++var28)
                {
                    var15 = (float)var28 * (float)Math.PI * 2.0F / 16.0F;
                    float var16 = MathHelper.sin(var15);
                    float var17 = MathHelper.cos(var15);
                    var24.addVertex((double)(var16 * 120.0F), (double)(var17 * 120.0F), (double)(-var17 * 40.0F * var25[3]));
                }

                var23.draw();
                GlStateManager.popMatrix();
                GlStateManager.shadeModel(7424);
            }

            GlStateManager.func_179098_w();
            GlStateManager.tryBlendFuncSeparate(770, 1, 1, 0);
            GlStateManager.pushMatrix();
            var10 = 1.0F - this.theWorld.getRainStrength(p_174976_1_);
            var11 = 0.0F;
            var12 = 0.0F;
            var13 = 0.0F;
            GlStateManager.color(1.0F, 1.0F, 1.0F, var10);
            GlStateManager.translate(0.0F, 0.0F, 0.0F);
            GlStateManager.rotate(-90.0F, 0.0F, 1.0F, 0.0F);
            GlStateManager.rotate(this.theWorld.getCelestialAngle(p_174976_1_) * 360.0F, 1.0F, 0.0F, 0.0F);
            var14 = 30.0F;
            this.renderEngine.bindTexture(locationSunPng);
            var24.startDrawingQuads();
            var24.addVertexWithUV((double)(-var14), 100.0D, (double)(-var14), 0.0D, 0.0D);
            var24.addVertexWithUV((double)var14, 100.0D, (double)(-var14), 1.0D, 0.0D);
            var24.addVertexWithUV((double)var14, 100.0D, (double)var14, 1.0D, 1.0D);
            var24.addVertexWithUV((double)(-var14), 100.0D, (double)var14, 0.0D, 1.0D);
            var23.draw();
            var14 = 20.0F;
            this.renderEngine.bindTexture(locationMoonPhasesPng);
            int var29 = this.theWorld.getMoonPhase();
            int var30 = var29 % 4;
            int var31 = var29 / 4 % 2;
            float var18 = (float)(var30 + 0) / 4.0F;
            float var19 = (float)(var31 + 0) / 2.0F;
            float var20 = (float)(var30 + 1) / 4.0F;
            float var21 = (float)(var31 + 1) / 2.0F;
            var24.startDrawingQuads();
            var24.addVertexWithUV((double)(-var14), -100.0D, (double)var14, (double)var20, (double)var21);
            var24.addVertexWithUV((double)var14, -100.0D, (double)var14, (double)var18, (double)var21);
            var24.addVertexWithUV((double)var14, -100.0D, (double)(-var14), (double)var18, (double)var19);
            var24.addVertexWithUV((double)(-var14), -100.0D, (double)(-var14), (double)var20, (double)var19);
            var23.draw();
            GlStateManager.func_179090_x();
            float var22 = this.theWorld.getStarBrightness(p_174976_1_) * var10;

            if (var22 > 0.0F)
            {
                GlStateManager.color(var22, var22, var22, var22);

                if (this.field_175005_X)
                {
                    this.field_175013_s.func_177359_a();
                    GL11.glEnableClientState(GL11.GL_VERTEX_ARRAY);
                    GL11.glVertexPointer(3, GL11.GL_FLOAT, 12, 0L);
                    this.field_175013_s.func_177358_a(7);
                    this.field_175013_s.func_177361_b();
                    GL11.glDisableClientState(GL11.GL_VERTEX_ARRAY);
                }
                else
                {
                    GlStateManager.callList(this.starGLCallList);
                }
            }

            GlStateManager.color(1.0F, 1.0F, 1.0F, 1.0F);
            GlStateManager.disableBlend();
            GlStateManager.enableAlpha();
            GlStateManager.enableFog();
            GlStateManager.popMatrix();
            GlStateManager.func_179090_x();
            GlStateManager.color(0.0F, 0.0F, 0.0F);
            double var26 = this.mc.thePlayer.func_174824_e(p_174976_1_).yCoord - this.theWorld.getHorizon();

            if (var26 < 0.0D)
            {
                GlStateManager.pushMatrix();
                GlStateManager.translate(0.0F, 12.0F, 0.0F);

                if (this.field_175005_X)
                {
                    this.field_175011_u.func_177359_a();
                    GL11.glEnableClientState(GL11.GL_VERTEX_ARRAY);
                    GL11.glVertexPointer(3, GL11.GL_FLOAT, 12, 0L);
                    this.field_175011_u.func_177358_a(7);
                    this.field_175011_u.func_177361_b();
                    GL11.glDisableClientState(GL11.GL_VERTEX_ARRAY);
                }
                else
                {
                    GlStateManager.callList(this.glSkyList2);
                }

                GlStateManager.popMatrix();
                var12 = 1.0F;
                var13 = -((float)(var26 + 65.0D));
                var14 = -1.0F;
                var24.startDrawingQuads();
                var24.func_178974_a(0, 255);
                var24.addVertex(-1.0D, (double)var13, 1.0D);
                var24.addVertex(1.0D, (double)var13, 1.0D);
                var24.addVertex(1.0D, -1.0D, 1.0D);
                var24.addVertex(-1.0D, -1.0D, 1.0D);
                var24.addVertex(-1.0D, -1.0D, -1.0D);
                var24.addVertex(1.0D, -1.0D, -1.0D);
                var24.addVertex(1.0D, (double)var13, -1.0D);
                var24.addVertex(-1.0D, (double)var13, -1.0D);
                var24.addVertex(1.0D, -1.0D, -1.0D);
                var24.addVertex(1.0D, -1.0D, 1.0D);
                var24.addVertex(1.0D, (double)var13, 1.0D);
                var24.addVertex(1.0D, (double)var13, -1.0D);
                var24.addVertex(-1.0D, (double)var13, -1.0D);
                var24.addVertex(-1.0D, (double)var13, 1.0D);
                var24.addVertex(-1.0D, -1.0D, 1.0D);
                var24.addVertex(-1.0D, -1.0D, -1.0D);
                var24.addVertex(-1.0D, -1.0D, -1.0D);
                var24.addVertex(-1.0D, -1.0D, 1.0D);
                var24.addVertex(1.0D, -1.0D, 1.0D);
                var24.addVertex(1.0D, -1.0D, -1.0D);
                var23.draw();
            }

            if (this.theWorld.provider.isSkyColored())
            {
                GlStateManager.color(var4 * 0.2F + 0.04F, var5 * 0.2F + 0.04F, var6 * 0.6F + 0.1F);
            }
            else
            {
                GlStateManager.color(var4, var5, var6);
            }

            GlStateManager.pushMatrix();
            GlStateManager.translate(0.0F, -((float)(var26 - 16.0D)), 0.0F);
            GlStateManager.callList(this.glSkyList2);
            GlStateManager.popMatrix();
            GlStateManager.func_179098_w();
            GlStateManager.depthMask(true);
        }
    }

    public void func_180447_b(float p_180447_1_, int p_180447_2_)
    {
        if (this.mc.theWorld.provider.isSurfaceWorld())
        {
            if (this.mc.gameSettings.fancyGraphics)
            {
                this.func_180445_c(p_180447_1_, p_180447_2_);
            }
            else
            {
                GlStateManager.disableCull();
                float var3 = (float)(this.mc.func_175606_aa().lastTickPosY + (this.mc.func_175606_aa().posY - this.mc.func_175606_aa().lastTickPosY) * (double)p_180447_1_);
                boolean var4 = true;
                boolean var5 = true;
                Tessellator var6 = Tessellator.getInstance();
                WorldRenderer var7 = var6.getWorldRenderer();
                this.renderEngine.bindTexture(locationCloudsPng);
                GlStateManager.enableBlend();
                GlStateManager.tryBlendFuncSeparate(770, 771, 1, 0);
                Vec3 var8 = this.theWorld.getCloudColour(p_180447_1_);
                float var9 = (float)var8.xCoord;
                float var10 = (float)var8.yCoord;
                float var11 = (float)var8.zCoord;
                float var12;

                if (p_180447_2_ != 2)
                {
                    var12 = (var9 * 30.0F + var10 * 59.0F + var11 * 11.0F) / 100.0F;
                    float var13 = (var9 * 30.0F + var10 * 70.0F) / 100.0F;
                    float var14 = (var9 * 30.0F + var11 * 70.0F) / 100.0F;
                    var9 = var12;
                    var10 = var13;
                    var11 = var14;
                }

                var12 = 4.8828125E-4F;
                double var26 = (double)((float)this.cloudTickCounter + p_180447_1_);
                double var15 = this.mc.func_175606_aa().prevPosX + (this.mc.func_175606_aa().posX - this.mc.func_175606_aa().prevPosX) * (double)p_180447_1_ + var26 * 0.029999999329447746D;
                double var17 = this.mc.func_175606_aa().prevPosZ + (this.mc.func_175606_aa().posZ - this.mc.func_175606_aa().prevPosZ) * (double)p_180447_1_;
                int var19 = MathHelper.floor_double(var15 / 2048.0D);
                int var20 = MathHelper.floor_double(var17 / 2048.0D);
                var15 -= (double)(var19 * 2048);
                var17 -= (double)(var20 * 2048);
                float var21 = this.theWorld.provider.getCloudHeight() - var3 + 0.33F;
                float var22 = (float)(var15 * 4.8828125E-4D);
                float var23 = (float)(var17 * 4.8828125E-4D);
                var7.startDrawingQuads();
                var7.func_178960_a(var9, var10, var11, 0.8F);

                for (int var24 = -256; var24 < 256; var24 += 32)
                {
                    for (int var25 = -256; var25 < 256; var25 += 32)
                    {
                        var7.addVertexWithUV((double)(var24 + 0), (double)var21, (double)(var25 + 32), (double)((float)(var24 + 0) * 4.8828125E-4F + var22), (double)((float)(var25 + 32) * 4.8828125E-4F + var23));
                        var7.addVertexWithUV((double)(var24 + 32), (double)var21, (double)(var25 + 32), (double)((float)(var24 + 32) * 4.8828125E-4F + var22), (double)((float)(var25 + 32) * 4.8828125E-4F + var23));
                        var7.addVertexWithUV((double)(var24 + 32), (double)var21, (double)(var25 + 0), (double)((float)(var24 + 32) * 4.8828125E-4F + var22), (double)((float)(var25 + 0) * 4.8828125E-4F + var23));
                        var7.addVertexWithUV((double)(var24 + 0), (double)var21, (double)(var25 + 0), (double)((float)(var24 + 0) * 4.8828125E-4F + var22), (double)((float)(var25 + 0) * 4.8828125E-4F + var23));
                    }
                }

                var6.draw();
                GlStateManager.color(1.0F, 1.0F, 1.0F, 1.0F);
                GlStateManager.disableBlend();
                GlStateManager.enableCull();
            }
        }
    }

    /**
     * Checks if the given position is to be rendered with cloud fog
     */
    public boolean hasCloudFog(double p_72721_1_, double p_72721_3_, double p_72721_5_, float p_72721_7_)
    {
        return false;
    }

    private void func_180445_c(float p_180445_1_, int p_180445_2_)
    {
        GlStateManager.disableCull();
        float var3 = (float)(this.mc.func_175606_aa().lastTickPosY + (this.mc.func_175606_aa().posY - this.mc.func_175606_aa().lastTickPosY) * (double)p_180445_1_);
        Tessellator var4 = Tessellator.getInstance();
        WorldRenderer var5 = var4.getWorldRenderer();
        float var6 = 12.0F;
        float var7 = 4.0F;
        double var8 = (double)((float)this.cloudTickCounter + p_180445_1_);
        double var10 = (this.mc.func_175606_aa().prevPosX + (this.mc.func_175606_aa().posX - this.mc.func_175606_aa().prevPosX) * (double)p_180445_1_ + var8 * 0.029999999329447746D) / 12.0D;
        double var12 = (this.mc.func_175606_aa().prevPosZ + (this.mc.func_175606_aa().posZ - this.mc.func_175606_aa().prevPosZ) * (double)p_180445_1_) / 12.0D + 0.33000001311302185D;
        float var14 = this.theWorld.provider.getCloudHeight() - var3 + 0.33F;
        int var15 = MathHelper.floor_double(var10 / 2048.0D);
        int var16 = MathHelper.floor_double(var12 / 2048.0D);
        var10 -= (double)(var15 * 2048);
        var12 -= (double)(var16 * 2048);
        this.renderEngine.bindTexture(locationCloudsPng);
        GlStateManager.enableBlend();
        GlStateManager.tryBlendFuncSeparate(770, 771, 1, 0);
        Vec3 var17 = this.theWorld.getCloudColour(p_180445_1_);
        float var18 = (float)var17.xCoord;
        float var19 = (float)var17.yCoord;
        float var20 = (float)var17.zCoord;
        float var21;
        float var22;
        float var23;

        if (p_180445_2_ != 2)
        {
            var21 = (var18 * 30.0F + var19 * 59.0F + var20 * 11.0F) / 100.0F;
            var22 = (var18 * 30.0F + var19 * 70.0F) / 100.0F;
            var23 = (var18 * 30.0F + var20 * 70.0F) / 100.0F;
            var18 = var21;
            var19 = var22;
            var20 = var23;
        }

        var21 = 0.00390625F;
        var22 = (float)MathHelper.floor_double(var10) * 0.00390625F;
        var23 = (float)MathHelper.floor_double(var12) * 0.00390625F;
        float var24 = (float)(var10 - (double)MathHelper.floor_double(var10));
        float var25 = (float)(var12 - (double)MathHelper.floor_double(var12));
        boolean var26 = true;
        boolean var27 = true;
        float var28 = 9.765625E-4F;
        GlStateManager.scale(12.0F, 1.0F, 12.0F);

        for (int var29 = 0; var29 < 2; ++var29)
        {
            if (var29 == 0)
            {
                GlStateManager.colorMask(false, false, false, false);
            }
            else
            {
                switch (p_180445_2_)
                {
                    case 0:
                        GlStateManager.colorMask(false, true, true, true);
                        break;

                    case 1:
                        GlStateManager.colorMask(true, false, false, true);
                        break;

                    case 2:
                        GlStateManager.colorMask(true, true, true, true);
                }
            }

            for (int var30 = -3; var30 <= 4; ++var30)
            {
                for (int var31 = -3; var31 <= 4; ++var31)
                {
                    var5.startDrawingQuads();
                    float var32 = (float)(var30 * 8);
                    float var33 = (float)(var31 * 8);
                    float var34 = var32 - var24;
                    float var35 = var33 - var25;

                    if (var14 > -5.0F)
                    {
                        var5.func_178960_a(var18 * 0.7F, var19 * 0.7F, var20 * 0.7F, 0.8F);
                        var5.func_178980_d(0.0F, -1.0F, 0.0F);
                        var5.addVertexWithUV((double)(var34 + 0.0F), (double)(var14 + 0.0F), (double)(var35 + 8.0F), (double)((var32 + 0.0F) * 0.00390625F + var22), (double)((var33 + 8.0F) * 0.00390625F + var23));
                        var5.addVertexWithUV((double)(var34 + 8.0F), (double)(var14 + 0.0F), (double)(var35 + 8.0F), (double)((var32 + 8.0F) * 0.00390625F + var22), (double)((var33 + 8.0F) * 0.00390625F + var23));
                        var5.addVertexWithUV((double)(var34 + 8.0F), (double)(var14 + 0.0F), (double)(var35 + 0.0F), (double)((var32 + 8.0F) * 0.00390625F + var22), (double)((var33 + 0.0F) * 0.00390625F + var23));
                        var5.addVertexWithUV((double)(var34 + 0.0F), (double)(var14 + 0.0F), (double)(var35 + 0.0F), (double)((var32 + 0.0F) * 0.00390625F + var22), (double)((var33 + 0.0F) * 0.00390625F + var23));
                    }

                    if (var14 <= 5.0F)
                    {
                        var5.func_178960_a(var18, var19, var20, 0.8F);
                        var5.func_178980_d(0.0F, 1.0F, 0.0F);
                        var5.addVertexWithUV((double)(var34 + 0.0F), (double)(var14 + 4.0F - 9.765625E-4F), (double)(var35 + 8.0F), (double)((var32 + 0.0F) * 0.00390625F + var22), (double)((var33 + 8.0F) * 0.00390625F + var23));
                        var5.addVertexWithUV((double)(var34 + 8.0F), (double)(var14 + 4.0F - 9.765625E-4F), (double)(var35 + 8.0F), (double)((var32 + 8.0F) * 0.00390625F + var22), (double)((var33 + 8.0F) * 0.00390625F + var23));
                        var5.addVertexWithUV((double)(var34 + 8.0F), (double)(var14 + 4.0F - 9.765625E-4F), (double)(var35 + 0.0F), (double)((var32 + 8.0F) * 0.00390625F + var22), (double)((var33 + 0.0F) * 0.00390625F + var23));
                        var5.addVertexWithUV((double)(var34 + 0.0F), (double)(var14 + 4.0F - 9.765625E-4F), (double)(var35 + 0.0F), (double)((var32 + 0.0F) * 0.00390625F + var22), (double)((var33 + 0.0F) * 0.00390625F + var23));
                    }

                    var5.func_178960_a(var18 * 0.9F, var19 * 0.9F, var20 * 0.9F, 0.8F);
                    int var36;

                    if (var30 > -1)
                    {
                        var5.func_178980_d(-1.0F, 0.0F, 0.0F);

                        for (var36 = 0; var36 < 8; ++var36)
                        {
                            var5.addVertexWithUV((double)(var34 + (float)var36 + 0.0F), (double)(var14 + 0.0F), (double)(var35 + 8.0F), (double)((var32 + (float)var36 + 0.5F) * 0.00390625F + var22), (double)((var33 + 8.0F) * 0.00390625F + var23));
                            var5.addVertexWithUV((double)(var34 + (float)var36 + 0.0F), (double)(var14 + 4.0F), (double)(var35 + 8.0F), (double)((var32 + (float)var36 + 0.5F) * 0.00390625F + var22), (double)((var33 + 8.0F) * 0.00390625F + var23));
                            var5.addVertexWithUV((double)(var34 + (float)var36 + 0.0F), (double)(var14 + 4.0F), (double)(var35 + 0.0F), (double)((var32 + (float)var36 + 0.5F) * 0.00390625F + var22), (double)((var33 + 0.0F) * 0.00390625F + var23));
                            var5.addVertexWithUV((double)(var34 + (float)var36 + 0.0F), (double)(var14 + 0.0F), (double)(var35 + 0.0F), (double)((var32 + (float)var36 + 0.5F) * 0.00390625F + var22), (double)((var33 + 0.0F) * 0.00390625F + var23));
                        }
                    }

                    if (var30 <= 1)
                    {
                        var5.func_178980_d(1.0F, 0.0F, 0.0F);

                        for (var36 = 0; var36 < 8; ++var36)
                        {
                            var5.addVertexWithUV((double)(var34 + (float)var36 + 1.0F - 9.765625E-4F), (double)(var14 + 0.0F), (double)(var35 + 8.0F), (double)((var32 + (float)var36 + 0.5F) * 0.00390625F + var22), (double)((var33 + 8.0F) * 0.00390625F + var23));
                            var5.addVertexWithUV((double)(var34 + (float)var36 + 1.0F - 9.765625E-4F), (double)(var14 + 4.0F), (double)(var35 + 8.0F), (double)((var32 + (float)var36 + 0.5F) * 0.00390625F + var22), (double)((var33 + 8.0F) * 0.00390625F + var23));
                            var5.addVertexWithUV((double)(var34 + (float)var36 + 1.0F - 9.765625E-4F), (double)(var14 + 4.0F), (double)(var35 + 0.0F), (double)((var32 + (float)var36 + 0.5F) * 0.00390625F + var22), (double)((var33 + 0.0F) * 0.00390625F + var23));
                            var5.addVertexWithUV((double)(var34 + (float)var36 + 1.0F - 9.765625E-4F), (double)(var14 + 0.0F), (double)(var35 + 0.0F), (double)((var32 + (float)var36 + 0.5F) * 0.00390625F + var22), (double)((var33 + 0.0F) * 0.00390625F + var23));
                        }
                    }

                    var5.func_178960_a(var18 * 0.8F, var19 * 0.8F, var20 * 0.8F, 0.8F);

                    if (var31 > -1)
                    {
                        var5.func_178980_d(0.0F, 0.0F, -1.0F);

                        for (var36 = 0; var36 < 8; ++var36)
                        {
                            var5.addVertexWithUV((double)(var34 + 0.0F), (double)(var14 + 4.0F), (double)(var35 + (float)var36 + 0.0F), (double)((var32 + 0.0F) * 0.00390625F + var22), (double)((var33 + (float)var36 + 0.5F) * 0.00390625F + var23));
                            var5.addVertexWithUV((double)(var34 + 8.0F), (double)(var14 + 4.0F), (double)(var35 + (float)var36 + 0.0F), (double)((var32 + 8.0F) * 0.00390625F + var22), (double)((var33 + (float)var36 + 0.5F) * 0.00390625F + var23));
                            var5.addVertexWithUV((double)(var34 + 8.0F), (double)(var14 + 0.0F), (double)(var35 + (float)var36 + 0.0F), (double)((var32 + 8.0F) * 0.00390625F + var22), (double)((var33 + (float)var36 + 0.5F) * 0.00390625F + var23));
                            var5.addVertexWithUV((double)(var34 + 0.0F), (double)(var14 + 0.0F), (double)(var35 + (float)var36 + 0.0F), (double)((var32 + 0.0F) * 0.00390625F + var22), (double)((var33 + (float)var36 + 0.5F) * 0.00390625F + var23));
                        }
                    }

                    if (var31 <= 1)
                    {
                        var5.func_178980_d(0.0F, 0.0F, 1.0F);

                        for (var36 = 0; var36 < 8; ++var36)
                        {
                            var5.addVertexWithUV((double)(var34 + 0.0F), (double)(var14 + 4.0F), (double)(var35 + (float)var36 + 1.0F - 9.765625E-4F), (double)((var32 + 0.0F) * 0.00390625F + var22), (double)((var33 + (float)var36 + 0.5F) * 0.00390625F + var23));
                            var5.addVertexWithUV((double)(var34 + 8.0F), (double)(var14 + 4.0F), (double)(var35 + (float)var36 + 1.0F - 9.765625E-4F), (double)((var32 + 8.0F) * 0.00390625F + var22), (double)((var33 + (float)var36 + 0.5F) * 0.00390625F + var23));
                            var5.addVertexWithUV((double)(var34 + 8.0F), (double)(var14 + 0.0F), (double)(var35 + (float)var36 + 1.0F - 9.765625E-4F), (double)((var32 + 8.0F) * 0.00390625F + var22), (double)((var33 + (float)var36 + 0.5F) * 0.00390625F + var23));
                            var5.addVertexWithUV((double)(var34 + 0.0F), (double)(var14 + 0.0F), (double)(var35 + (float)var36 + 1.0F - 9.765625E-4F), (double)((var32 + 0.0F) * 0.00390625F + var22), (double)((var33 + (float)var36 + 0.5F) * 0.00390625F + var23));
                        }
                    }

                    var4.draw();
                }
            }
        }

        GlStateManager.color(1.0F, 1.0F, 1.0F, 1.0F);
        GlStateManager.disableBlend();
        GlStateManager.enableCull();
    }

    public void func_174967_a(long p_174967_1_)
    {
        this.displayListEntitiesDirty |= this.field_174995_M.func_178516_a(p_174967_1_);
        Iterator var3 = this.field_175009_l.iterator();

        while (var3.hasNext())
        {
            RenderChunk var4 = (RenderChunk)var3.next();

            if (!this.field_174995_M.func_178507_a(var4))
            {
                break;
            }

            var4.func_178575_a(false);
            var3.remove();
        }
    }

    public void func_180449_a(Entity p_180449_1_, float p_180449_2_)
    {
        Tessellator var3 = Tessellator.getInstance();
        WorldRenderer var4 = var3.getWorldRenderer();
        WorldBorder var5 = this.theWorld.getWorldBorder();
        double var6 = (double)(this.mc.gameSettings.renderDistanceChunks * 16);

        if (p_180449_1_.posX >= var5.maxX() - var6 || p_180449_1_.posX <= var5.minX() + var6 || p_180449_1_.posZ >= var5.maxZ() - var6 || p_180449_1_.posZ <= var5.minZ() + var6)
        {
            double var8 = 1.0D - var5.getClosestDistance(p_180449_1_) / var6;
            var8 = Math.pow(var8, 4.0D);
            double var10 = p_180449_1_.lastTickPosX + (p_180449_1_.posX - p_180449_1_.lastTickPosX) * (double)p_180449_2_;
            double var12 = p_180449_1_.lastTickPosY + (p_180449_1_.posY - p_180449_1_.lastTickPosY) * (double)p_180449_2_;
            double var14 = p_180449_1_.lastTickPosZ + (p_180449_1_.posZ - p_180449_1_.lastTickPosZ) * (double)p_180449_2_;
            GlStateManager.enableBlend();
            GlStateManager.tryBlendFuncSeparate(770, 1, 1, 0);
            this.renderEngine.bindTexture(field_175006_g);
            GlStateManager.depthMask(false);
            GlStateManager.pushMatrix();
            int var16 = var5.getStatus().func_177766_a();
            float var17 = (float)(var16 >> 16 & 255) / 255.0F;
            float var18 = (float)(var16 >> 8 & 255) / 255.0F;
            float var19 = (float)(var16 & 255) / 255.0F;
            GlStateManager.color(var17, var18, var19, (float)var8);
            GlStateManager.doPolygonOffset(-3.0F, -3.0F);
            GlStateManager.enablePolygonOffset();
            GlStateManager.alphaFunc(516, 0.1F);
            GlStateManager.enableAlpha();
            GlStateManager.disableCull();
            float var20 = (float)(Minecraft.getSystemTime() % 3000L) / 3000.0F;
            float var21 = 0.0F;
            float var22 = 0.0F;
            float var23 = 128.0F;
            var4.startDrawingQuads();
            var4.setTranslation(-var10, -var12, -var14);
            var4.markDirty();
            double var24 = Math.max((double)MathHelper.floor_double(var14 - var6), var5.minZ());
            double var26 = Math.min((double)MathHelper.ceiling_double_int(var14 + var6), var5.maxZ());
            float var28;
            double var29;
            double var31;
            float var33;

            if (var10 > var5.maxX() - var6)
            {
                var28 = 0.0F;

                for (var29 = var24; var29 < var26; var28 += 0.5F)
                {
                    var31 = Math.min(1.0D, var26 - var29);
                    var33 = (float)var31 * 0.5F;
                    var4.addVertexWithUV(var5.maxX(), 256.0D, var29, (double)(var20 + var28), (double)(var20 + 0.0F));
                    var4.addVertexWithUV(var5.maxX(), 256.0D, var29 + var31, (double)(var20 + var33 + var28), (double)(var20 + 0.0F));
                    var4.addVertexWithUV(var5.maxX(), 0.0D, var29 + var31, (double)(var20 + var33 + var28), (double)(var20 + 128.0F));
                    var4.addVertexWithUV(var5.maxX(), 0.0D, var29, (double)(var20 + var28), (double)(var20 + 128.0F));
                    ++var29;
                }
            }

            if (var10 < var5.minX() + var6)
            {
                var28 = 0.0F;

                for (var29 = var24; var29 < var26; var28 += 0.5F)
                {
                    var31 = Math.min(1.0D, var26 - var29);
                    var33 = (float)var31 * 0.5F;
                    var4.addVertexWithUV(var5.minX(), 256.0D, var29, (double)(var20 + var28), (double)(var20 + 0.0F));
                    var4.addVertexWithUV(var5.minX(), 256.0D, var29 + var31, (double)(var20 + var33 + var28), (double)(var20 + 0.0F));
                    var4.addVertexWithUV(var5.minX(), 0.0D, var29 + var31, (double)(var20 + var33 + var28), (double)(var20 + 128.0F));
                    var4.addVertexWithUV(var5.minX(), 0.0D, var29, (double)(var20 + var28), (double)(var20 + 128.0F));
                    ++var29;
                }
            }

            var24 = Math.max((double)MathHelper.floor_double(var10 - var6), var5.minX());
            var26 = Math.min((double)MathHelper.ceiling_double_int(var10 + var6), var5.maxX());

            if (var14 > var5.maxZ() - var6)
            {
                var28 = 0.0F;

                for (var29 = var24; var29 < var26; var28 += 0.5F)
                {
                    var31 = Math.min(1.0D, var26 - var29);
                    var33 = (float)var31 * 0.5F;
                    var4.addVertexWithUV(var29, 256.0D, var5.maxZ(), (double)(var20 + var28), (double)(var20 + 0.0F));
                    var4.addVertexWithUV(var29 + var31, 256.0D, var5.maxZ(), (double)(var20 + var33 + var28), (double)(var20 + 0.0F));
                    var4.addVertexWithUV(var29 + var31, 0.0D, var5.maxZ(), (double)(var20 + var33 + var28), (double)(var20 + 128.0F));
                    var4.addVertexWithUV(var29, 0.0D, var5.maxZ(), (double)(var20 + var28), (double)(var20 + 128.0F));
                    ++var29;
                }
            }

            if (var14 < var5.minZ() + var6)
            {
                var28 = 0.0F;

                for (var29 = var24; var29 < var26; var28 += 0.5F)
                {
                    var31 = Math.min(1.0D, var26 - var29);
                    var33 = (float)var31 * 0.5F;
                    var4.addVertexWithUV(var29, 256.0D, var5.minZ(), (double)(var20 + var28), (double)(var20 + 0.0F));
                    var4.addVertexWithUV(var29 + var31, 256.0D, var5.minZ(), (double)(var20 + var33 + var28), (double)(var20 + 0.0F));
                    var4.addVertexWithUV(var29 + var31, 0.0D, var5.minZ(), (double)(var20 + var33 + var28), (double)(var20 + 128.0F));
                    var4.addVertexWithUV(var29, 0.0D, var5.minZ(), (double)(var20 + var28), (double)(var20 + 128.0F));
                    ++var29;
                }
            }

            var3.draw();
            var4.setTranslation(0.0D, 0.0D, 0.0D);
            GlStateManager.enableCull();
            GlStateManager.disableAlpha();
            GlStateManager.doPolygonOffset(0.0F, 0.0F);
            GlStateManager.disablePolygonOffset();
            GlStateManager.enableAlpha();
            GlStateManager.disableBlend();
            GlStateManager.popMatrix();
            GlStateManager.depthMask(true);
        }
    }

    private void func_180443_s()
    {
        GlStateManager.tryBlendFuncSeparate(774, 768, 1, 0);
        GlStateManager.enableBlend();
        GlStateManager.color(1.0F, 1.0F, 1.0F, 0.5F);
        GlStateManager.doPolygonOffset(-3.0F, -3.0F);
        GlStateManager.enablePolygonOffset();
        GlStateManager.alphaFunc(516, 0.1F);
        GlStateManager.enableAlpha();
        GlStateManager.pushMatrix();
    }

    private void func_174969_t()
    {
        GlStateManager.disableAlpha();
        GlStateManager.doPolygonOffset(0.0F, 0.0F);
        GlStateManager.disablePolygonOffset();
        GlStateManager.enableAlpha();
        GlStateManager.depthMask(true);
        GlStateManager.popMatrix();
    }

    public void func_174981_a(Tessellator p_174981_1_, WorldRenderer p_174981_2_, Entity p_174981_3_, float p_174981_4_)
    {
        double var5 = p_174981_3_.lastTickPosX + (p_174981_3_.posX - p_174981_3_.lastTickPosX) * (double)p_174981_4_;
        double var7 = p_174981_3_.lastTickPosY + (p_174981_3_.posY - p_174981_3_.lastTickPosY) * (double)p_174981_4_;
        double var9 = p_174981_3_.lastTickPosZ + (p_174981_3_.posZ - p_174981_3_.lastTickPosZ) * (double)p_174981_4_;

        if (!this.damagedBlocks.isEmpty())
        {
            this.renderEngine.bindTexture(TextureMap.locationBlocksTexture);
            this.func_180443_s();
            p_174981_2_.startDrawingQuads();
            p_174981_2_.setVertexFormat(DefaultVertexFormats.field_176600_a);
            p_174981_2_.setTranslation(-var5, -var7, -var9);
            p_174981_2_.markDirty();
            Iterator var11 = this.damagedBlocks.values().iterator();

            while (var11.hasNext())
            {
                DestroyBlockProgress var12 = (DestroyBlockProgress)var11.next();
                BlockPos var13 = var12.func_180246_b();
                double var14 = (double)var13.getX() - var5;
                double var16 = (double)var13.getY() - var7;
                double var18 = (double)var13.getZ() - var9;
                Block var20 = this.theWorld.getBlockState(var13).getBlock();

                if (!(var20 instanceof BlockChest) && !(var20 instanceof BlockEnderChest) && !(var20 instanceof BlockSign) && !(var20 instanceof BlockSkull))
                {
                    if (var14 * var14 + var16 * var16 + var18 * var18 > 1024.0D)
                    {
                        var11.remove();
                    }
                    else
                    {
                        IBlockState var21 = this.theWorld.getBlockState(var13);

                        if (var21.getBlock().getMaterial() != Material.air)
                        {
                            int var22 = var12.getPartialBlockDamage();
                            TextureAtlasSprite var23 = this.destroyBlockIcons[var22];
                            BlockRendererDispatcher var24 = this.mc.getBlockRendererDispatcher();
                            var24.func_175020_a(var21, var13, var23, this.theWorld);
                        }
                    }
                }
            }

            p_174981_1_.draw();
            p_174981_2_.setTranslation(0.0D, 0.0D, 0.0D);
            this.func_174969_t();
        }
    }

    /**
     * Draws the selection box for the player. Args: entityPlayer, rayTraceHit, i, itemStack, partialTickTime
     */
    public void drawSelectionBox(EntityPlayer p_72731_1_, MovingObjectPosition p_72731_2_, int p_72731_3_, float p_72731_4_)
    {
        if (p_72731_3_ == 0 && p_72731_2_.typeOfHit == MovingObjectPosition.MovingObjectType.BLOCK)
        {
            GlStateManager.enableBlend();
            GlStateManager.tryBlendFuncSeparate(770, 771, 1, 0);
            GlStateManager.color(0.0F, 0.0F, 0.0F, 0.4F);
            GL11.glLineWidth(2.0F);
            GlStateManager.func_179090_x();
            GlStateManager.depthMask(false);
            float var5 = 0.002F;
            BlockPos var6 = p_72731_2_.func_178782_a();
            Block var7 = this.theWorld.getBlockState(var6).getBlock();

            if (var7.getMaterial() != Material.air && this.theWorld.getWorldBorder().contains(var6))
            {
                var7.setBlockBoundsBasedOnState(this.theWorld, var6);
                double var8 = p_72731_1_.lastTickPosX + (p_72731_1_.posX - p_72731_1_.lastTickPosX) * (double)p_72731_4_;
                double var10 = p_72731_1_.lastTickPosY + (p_72731_1_.posY - p_72731_1_.lastTickPosY) * (double)p_72731_4_;
                double var12 = p_72731_1_.lastTickPosZ + (p_72731_1_.posZ - p_72731_1_.lastTickPosZ) * (double)p_72731_4_;
                drawOutlinedBoundingBox(var7.getSelectedBoundingBox(this.theWorld, var6).expand(0.0020000000949949026D, 0.0020000000949949026D, 0.0020000000949949026D).offset(-var8, -var10, -var12), -1);
            }

            GlStateManager.depthMask(true);
            GlStateManager.func_179098_w();
            GlStateManager.disableBlend();
        }
    }

    /**
     * Draws lines for the edges of the bounding box.
     */
    public static void drawOutlinedBoundingBox(AxisAlignedBB p_147590_0_, int p_147590_1_)
    {
        Tessellator var2 = Tessellator.getInstance();
        WorldRenderer var3 = var2.getWorldRenderer();
        var3.startDrawing(3);

        if (p_147590_1_ != -1)
        {
            var3.func_178991_c(p_147590_1_);
        }

        var3.addVertex(p_147590_0_.minX, p_147590_0_.minY, p_147590_0_.minZ);
        var3.addVertex(p_147590_0_.maxX, p_147590_0_.minY, p_147590_0_.minZ);
        var3.addVertex(p_147590_0_.maxX, p_147590_0_.minY, p_147590_0_.maxZ);
        var3.addVertex(p_147590_0_.minX, p_147590_0_.minY, p_147590_0_.maxZ);
        var3.addVertex(p_147590_0_.minX, p_147590_0_.minY, p_147590_0_.minZ);
        var2.draw();
        var3.startDrawing(3);

        if (p_147590_1_ != -1)
        {
            var3.func_178991_c(p_147590_1_);
        }

        var3.addVertex(p_147590_0_.minX, p_147590_0_.maxY, p_147590_0_.minZ);
        var3.addVertex(p_147590_0_.maxX, p_147590_0_.maxY, p_147590_0_.minZ);
        var3.addVertex(p_147590_0_.maxX, p_147590_0_.maxY, p_147590_0_.maxZ);
        var3.addVertex(p_147590_0_.minX, p_147590_0_.maxY, p_147590_0_.maxZ);
        var3.addVertex(p_147590_0_.minX, p_147590_0_.maxY, p_147590_0_.minZ);
        var2.draw();
        var3.startDrawing(1);

        if (p_147590_1_ != -1)
        {
            var3.func_178991_c(p_147590_1_);
        }

        var3.addVertex(p_147590_0_.minX, p_147590_0_.minY, p_147590_0_.minZ);
        var3.addVertex(p_147590_0_.minX, p_147590_0_.maxY, p_147590_0_.minZ);
        var3.addVertex(p_147590_0_.maxX, p_147590_0_.minY, p_147590_0_.minZ);
        var3.addVertex(p_147590_0_.maxX, p_147590_0_.maxY, p_147590_0_.minZ);
        var3.addVertex(p_147590_0_.maxX, p_147590_0_.minY, p_147590_0_.maxZ);
        var3.addVertex(p_147590_0_.maxX, p_147590_0_.maxY, p_147590_0_.maxZ);
        var3.addVertex(p_147590_0_.minX, p_147590_0_.minY, p_147590_0_.maxZ);
        var3.addVertex(p_147590_0_.minX, p_147590_0_.maxY, p_147590_0_.maxZ);
        var2.draw();
    }

    /**
     * Marks the blocks in the given range for update
     */
    private void markBlocksForUpdate(int p_72725_1_, int p_72725_2_, int p_72725_3_, int p_72725_4_, int p_72725_5_, int p_72725_6_)
    {
        this.field_175008_n.func_178162_a(p_72725_1_, p_72725_2_, p_72725_3_, p_72725_4_, p_72725_5_, p_72725_6_);
    }

    public void markBlockForUpdate(BlockPos pos)
    {
        int var2 = pos.getX();
        int var3 = pos.getY();
        int var4 = pos.getZ();
        this.markBlocksForUpdate(var2 - 1, var3 - 1, var4 - 1, var2 + 1, var3 + 1, var4 + 1);
    }

    public void notifyLightSet(BlockPos pos)
    {
        int var2 = pos.getX();
        int var3 = pos.getY();
        int var4 = pos.getZ();
        this.markBlocksForUpdate(var2 - 1, var3 - 1, var4 - 1, var2 + 1, var3 + 1, var4 + 1);
    }

    /**
     * On the client, re-renders all blocks in this range, inclusive. On the server, does nothing. Args: min x, min y,
     * min z, max x, max y, max z
     */
    public void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)
    {
        this.markBlocksForUpdate(x1 - 1, y1 - 1, z1 - 1, x2 + 1, y2 + 1, z2 + 1);
    }

    public void func_174961_a(String p_174961_1_, BlockPos p_174961_2_)
    {
        ISound var3 = (ISound)this.mapSoundPositions.get(p_174961_2_);

        if (var3 != null)
        {
            this.mc.getSoundHandler().stopSound(var3);
            this.mapSoundPositions.remove(p_174961_2_);
        }

        if (p_174961_1_ != null)
        {
            ItemRecord var4 = ItemRecord.getRecord(p_174961_1_);

            if (var4 != null)
            {
                this.mc.ingameGUI.setRecordPlayingMessage(var4.getRecordNameLocal());
            }

            PositionedSoundRecord var5 = PositionedSoundRecord.createRecordSoundAtPosition(new ResourceLocation(p_174961_1_), (float)p_174961_2_.getX(), (float)p_174961_2_.getY(), (float)p_174961_2_.getZ());
            this.mapSoundPositions.put(p_174961_2_, var5);
            this.mc.getSoundHandler().playSound(var5);
        }
    }

    /**
     * Plays the specified sound. Arg: soundName, x, y, z, volume, pitch
     */
    public void playSound(String soundName, double x, double y, double z, float volume, float pitch) {}

    /**
     * Plays sound to all near players except the player reference given
     */
    public void playSoundToNearExcept(EntityPlayer except, String soundName, double x, double y, double z, float volume, float pitch) {}

    public void func_180442_a(int p_180442_1_, boolean p_180442_2_, final double p_180442_3_, final double p_180442_5_, final double p_180442_7_, double p_180442_9_, double p_180442_11_, double p_180442_13_, int ... p_180442_15_)
    {
        try
        {
            this.func_174974_b(p_180442_1_, p_180442_2_, p_180442_3_, p_180442_5_, p_180442_7_, p_180442_9_, p_180442_11_, p_180442_13_, p_180442_15_);
        }
        catch (Throwable var19)
        {
            CrashReport var17 = CrashReport.makeCrashReport(var19, "Exception while adding particle");
            CrashReportCategory var18 = var17.makeCategory("Particle being added");
            var18.addCrashSection("ID", Integer.valueOf(p_180442_1_));

            if (p_180442_15_ != null)
            {
                var18.addCrashSection("Parameters", p_180442_15_);
            }

            var18.addCrashSectionCallable("Position", new Callable()
            {
                private static final String __OBFID = "CL_00000955";
                public String call()
                {
                    return CrashReportCategory.getCoordinateInfo(p_180442_3_, p_180442_5_, p_180442_7_);
                }
            });
            throw new ReportedException(var17);
        }
    }

    private void func_174972_a(EnumParticleTypes p_174972_1_, double p_174972_2_, double p_174972_4_, double p_174972_6_, double p_174972_8_, double p_174972_10_, double p_174972_12_, int ... p_174972_14_)
    {
        this.func_180442_a(p_174972_1_.func_179348_c(), p_174972_1_.func_179344_e(), p_174972_2_, p_174972_4_, p_174972_6_, p_174972_8_, p_174972_10_, p_174972_12_, p_174972_14_);
    }

    private EntityFX func_174974_b(int p_174974_1_, boolean p_174974_2_, double p_174974_3_, double p_174974_5_, double p_174974_7_, double p_174974_9_, double p_174974_11_, double p_174974_13_, int ... p_174974_15_)
    {
        if (this.mc != null && this.mc.func_175606_aa() != null && this.mc.effectRenderer != null)
        {
            int var16 = this.mc.gameSettings.particleSetting;

            if (var16 == 1 && this.theWorld.rand.nextInt(3) == 0)
            {
                var16 = 2;
            }

            double var17 = this.mc.func_175606_aa().posX - p_174974_3_;
            double var19 = this.mc.func_175606_aa().posY - p_174974_5_;
            double var21 = this.mc.func_175606_aa().posZ - p_174974_7_;

            if (p_174974_2_)
            {
                return this.mc.effectRenderer.func_178927_a(p_174974_1_, p_174974_3_, p_174974_5_, p_174974_7_, p_174974_9_, p_174974_11_, p_174974_13_, p_174974_15_);
            }
            else
            {
                double var23 = 16.0D;
                return var17 * var17 + var19 * var19 + var21 * var21 > 256.0D ? null : (var16 > 1 ? null : this.mc.effectRenderer.func_178927_a(p_174974_1_, p_174974_3_, p_174974_5_, p_174974_7_, p_174974_9_, p_174974_11_, p_174974_13_, p_174974_15_));
            }
        }
        else
        {
            return null;
        }
    }

    /**
     * Called on all IWorldAccesses when an entity is created or loaded. On client worlds, starts downloading any
     * necessary textures. On server worlds, adds the entity to the entity tracker.
     */
    public void onEntityAdded(Entity entityIn) {}

    /**
     * Called on all IWorldAccesses when an entity is unloaded or destroyed. On client worlds, releases any downloaded
     * textures. On server worlds, removes the entity from the entity tracker.
     */
    public void onEntityRemoved(Entity entityIn) {}

    /**
     * Deletes all display lists
     */
    public void deleteAllDisplayLists() {}

    public void func_180440_a(int p_180440_1_, BlockPos p_180440_2_, int p_180440_3_)
    {
        switch (p_180440_1_)
        {
            case 1013:
            case 1018:
                if (this.mc.func_175606_aa() != null)
                {
                    double var4 = (double)p_180440_2_.getX() - this.mc.func_175606_aa().posX;
                    double var6 = (double)p_180440_2_.getY() - this.mc.func_175606_aa().posY;
                    double var8 = (double)p_180440_2_.getZ() - this.mc.func_175606_aa().posZ;
                    double var10 = Math.sqrt(var4 * var4 + var6 * var6 + var8 * var8);
                    double var12 = this.mc.func_175606_aa().posX;
                    double var14 = this.mc.func_175606_aa().posY;
                    double var16 = this.mc.func_175606_aa().posZ;

                    if (var10 > 0.0D)
                    {
                        var12 += var4 / var10 * 2.0D;
                        var14 += var6 / var10 * 2.0D;
                        var16 += var8 / var10 * 2.0D;
                    }

                    if (p_180440_1_ == 1013)
                    {
                        this.theWorld.playSound(var12, var14, var16, "mob.wither.spawn", 1.0F, 1.0F, false);
                    }
                    else
                    {
                        this.theWorld.playSound(var12, var14, var16, "mob.enderdragon.end", 5.0F, 1.0F, false);
                    }
                }

            default:
        }
    }

    public void func_180439_a(EntityPlayer p_180439_1_, int p_180439_2_, BlockPos p_180439_3_, int p_180439_4_)
    {
        Random var5 = this.theWorld.rand;
        double var7;
        double var9;
        double var11;
        int var13;
        int var18;
        double var19;
        double var21;
        double var23;
        double var32;

        switch (p_180439_2_)
        {
            case 1000:
                this.theWorld.func_175731_a(p_180439_3_, "random.click", 1.0F, 1.0F, false);
                break;

            case 1001:
                this.theWorld.func_175731_a(p_180439_3_, "random.click", 1.0F, 1.2F, false);
                break;

            case 1002:
                this.theWorld.func_175731_a(p_180439_3_, "random.bow", 1.0F, 1.2F, false);
                break;

            case 1003:
                this.theWorld.func_175731_a(p_180439_3_, "random.door_open", 1.0F, this.theWorld.rand.nextFloat() * 0.1F + 0.9F, false);
                break;

            case 1004:
                this.theWorld.func_175731_a(p_180439_3_, "random.fizz", 0.5F, 2.6F + (var5.nextFloat() - var5.nextFloat()) * 0.8F, false);
                break;

            case 1005:
                if (Item.getItemById(p_180439_4_) instanceof ItemRecord)
                {
                    this.theWorld.func_175717_a(p_180439_3_, "records." + ((ItemRecord)Item.getItemById(p_180439_4_)).recordName);
                }
                else
                {
                    this.theWorld.func_175717_a(p_180439_3_, (String)null);
                }

                break;

            case 1006:
                this.theWorld.func_175731_a(p_180439_3_, "random.door_close", 1.0F, this.theWorld.rand.nextFloat() * 0.1F + 0.9F, false);
                break;

            case 1007:
                this.theWorld.func_175731_a(p_180439_3_, "mob.ghast.charge", 10.0F, (var5.nextFloat() - var5.nextFloat()) * 0.2F + 1.0F, false);
                break;

            case 1008:
                this.theWorld.func_175731_a(p_180439_3_, "mob.ghast.fireball", 10.0F, (var5.nextFloat() - var5.nextFloat()) * 0.2F + 1.0F, false);
                break;

            case 1009:
                this.theWorld.func_175731_a(p_180439_3_, "mob.ghast.fireball", 2.0F, (var5.nextFloat() - var5.nextFloat()) * 0.2F + 1.0F, false);
                break;

            case 1010:
                this.theWorld.func_175731_a(p_180439_3_, "mob.zombie.wood", 2.0F, (var5.nextFloat() - var5.nextFloat()) * 0.2F + 1.0F, false);
                break;

            case 1011:
                this.theWorld.func_175731_a(p_180439_3_, "mob.zombie.metal", 2.0F, (var5.nextFloat() - var5.nextFloat()) * 0.2F + 1.0F, false);
                break;

            case 1012:
                this.theWorld.func_175731_a(p_180439_3_, "mob.zombie.woodbreak", 2.0F, (var5.nextFloat() - var5.nextFloat()) * 0.2F + 1.0F, false);
                break;

            case 1014:
                this.theWorld.func_175731_a(p_180439_3_, "mob.wither.shoot", 2.0F, (var5.nextFloat() - var5.nextFloat()) * 0.2F + 1.0F, false);
                break;

            case 1015:
                this.theWorld.func_175731_a(p_180439_3_, "mob.bat.takeoff", 0.05F, (var5.nextFloat() - var5.nextFloat()) * 0.2F + 1.0F, false);
                break;

            case 1016:
                this.theWorld.func_175731_a(p_180439_3_, "mob.zombie.infect", 2.0F, (var5.nextFloat() - var5.nextFloat()) * 0.2F + 1.0F, false);
                break;

            case 1017:
                this.theWorld.func_175731_a(p_180439_3_, "mob.zombie.unfect", 2.0F, (var5.nextFloat() - var5.nextFloat()) * 0.2F + 1.0F, false);
                break;

            case 1020:
                this.theWorld.func_175731_a(p_180439_3_, "random.anvil_break", 1.0F, this.theWorld.rand.nextFloat() * 0.1F + 0.9F, false);
                break;

            case 1021:
                this.theWorld.func_175731_a(p_180439_3_, "random.anvil_use", 1.0F, this.theWorld.rand.nextFloat() * 0.1F + 0.9F, false);
                break;

            case 1022:
                this.theWorld.func_175731_a(p_180439_3_, "random.anvil_land", 0.3F, this.theWorld.rand.nextFloat() * 0.1F + 0.9F, false);
                break;

            case 2000:
                int var31 = p_180439_4_ % 3 - 1;
                int var8 = p_180439_4_ / 3 % 3 - 1;
                var9 = (double)p_180439_3_.getX() + (double)var31 * 0.6D + 0.5D;
                var11 = (double)p_180439_3_.getY() + 0.5D;
                var32 = (double)p_180439_3_.getZ() + (double)var8 * 0.6D + 0.5D;

                for (int var33 = 0; var33 < 10; ++var33)
                {
                    double var34 = var5.nextDouble() * 0.2D + 0.01D;
                    double var35 = var9 + (double)var31 * 0.01D + (var5.nextDouble() - 0.5D) * (double)var8 * 0.5D;
                    double var20 = var11 + (var5.nextDouble() - 0.5D) * 0.5D;
                    double var22 = var32 + (double)var8 * 0.01D + (var5.nextDouble() - 0.5D) * (double)var31 * 0.5D;
                    double var24 = (double)var31 * var34 + var5.nextGaussian() * 0.01D;
                    double var26 = -0.03D + var5.nextGaussian() * 0.01D;
                    double var28 = (double)var8 * var34 + var5.nextGaussian() * 0.01D;
                    this.func_174972_a(EnumParticleTypes.SMOKE_NORMAL, var35, var20, var22, var24, var26, var28, new int[0]);
                }

                return;

            case 2001:
                Block var6 = Block.getBlockById(p_180439_4_ & 4095);

                if (var6.getMaterial() != Material.air)
                {
                    this.mc.getSoundHandler().playSound(new PositionedSoundRecord(new ResourceLocation(var6.stepSound.getBreakSound()), (var6.stepSound.getVolume() + 1.0F) / 2.0F, var6.stepSound.getFrequency() * 0.8F, (float)p_180439_3_.getX() + 0.5F, (float)p_180439_3_.getY() + 0.5F, (float)p_180439_3_.getZ() + 0.5F));
                }

                this.mc.effectRenderer.func_180533_a(p_180439_3_, var6.getStateFromMeta(p_180439_4_ >> 12 & 255));
                break;

            case 2002:
                var7 = (double)p_180439_3_.getX();
                var9 = (double)p_180439_3_.getY();
                var11 = (double)p_180439_3_.getZ();

                for (var13 = 0; var13 < 8; ++var13)
                {
                    this.func_174972_a(EnumParticleTypes.ITEM_CRACK, var7, var9, var11, var5.nextGaussian() * 0.15D, var5.nextDouble() * 0.2D, var5.nextGaussian() * 0.15D, new int[] {Item.getIdFromItem(Items.potionitem), p_180439_4_});
                }

                var13 = Items.potionitem.getColorFromDamage(p_180439_4_);
                float var14 = (float)(var13 >> 16 & 255) / 255.0F;
                float var15 = (float)(var13 >> 8 & 255) / 255.0F;
                float var16 = (float)(var13 >> 0 & 255) / 255.0F;
                EnumParticleTypes var17 = EnumParticleTypes.SPELL;

                if (Items.potionitem.isEffectInstant(p_180439_4_))
                {
                    var17 = EnumParticleTypes.SPELL_INSTANT;
                }

                for (var18 = 0; var18 < 100; ++var18)
                {
                    var19 = var5.nextDouble() * 4.0D;
                    var21 = var5.nextDouble() * Math.PI * 2.0D;
                    var23 = Math.cos(var21) * var19;
                    double var25 = 0.01D + var5.nextDouble() * 0.5D;
                    double var27 = Math.sin(var21) * var19;
                    EntityFX var29 = this.func_174974_b(var17.func_179348_c(), var17.func_179344_e(), var7 + var23 * 0.1D, var9 + 0.3D, var11 + var27 * 0.1D, var23, var25, var27, new int[0]);

                    if (var29 != null)
                    {
                        float var30 = 0.75F + var5.nextFloat() * 0.25F;
                        var29.setRBGColorF(var14 * var30, var15 * var30, var16 * var30);
                        var29.multiplyVelocity((float)var19);
                    }
                }

                this.theWorld.func_175731_a(p_180439_3_, "game.potion.smash", 1.0F, this.theWorld.rand.nextFloat() * 0.1F + 0.9F, false);
                break;

            case 2003:
                var7 = (double)p_180439_3_.getX() + 0.5D;
                var9 = (double)p_180439_3_.getY();
                var11 = (double)p_180439_3_.getZ() + 0.5D;

                for (var13 = 0; var13 < 8; ++var13)
                {
                    this.func_174972_a(EnumParticleTypes.ITEM_CRACK, var7, var9, var11, var5.nextGaussian() * 0.15D, var5.nextDouble() * 0.2D, var5.nextGaussian() * 0.15D, new int[] {Item.getIdFromItem(Items.ender_eye)});
                }

                for (var32 = 0.0D; var32 < (Math.PI * 2D); var32 += 0.15707963267948966D)
                {
                    this.func_174972_a(EnumParticleTypes.PORTAL, var7 + Math.cos(var32) * 5.0D, var9 - 0.4D, var11 + Math.sin(var32) * 5.0D, Math.cos(var32) * -5.0D, 0.0D, Math.sin(var32) * -5.0D, new int[0]);
                    this.func_174972_a(EnumParticleTypes.PORTAL, var7 + Math.cos(var32) * 5.0D, var9 - 0.4D, var11 + Math.sin(var32) * 5.0D, Math.cos(var32) * -7.0D, 0.0D, Math.sin(var32) * -7.0D, new int[0]);
                }

                return;

            case 2004:
                for (var18 = 0; var18 < 20; ++var18)
                {
                    var19 = (double)p_180439_3_.getX() + 0.5D + ((double)this.theWorld.rand.nextFloat() - 0.5D) * 2.0D;
                    var21 = (double)p_180439_3_.getY() + 0.5D + ((double)this.theWorld.rand.nextFloat() - 0.5D) * 2.0D;
                    var23 = (double)p_180439_3_.getZ() + 0.5D + ((double)this.theWorld.rand.nextFloat() - 0.5D) * 2.0D;
                    this.theWorld.spawnParticle(EnumParticleTypes.SMOKE_NORMAL, var19, var21, var23, 0.0D, 0.0D, 0.0D, new int[0]);
                    this.theWorld.spawnParticle(EnumParticleTypes.FLAME, var19, var21, var23, 0.0D, 0.0D, 0.0D, new int[0]);
                }

                return;

            case 2005:
                ItemDye.func_180617_a(this.theWorld, p_180439_3_, p_180439_4_);
        }
    }

    public void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)
    {
        if (progress >= 0 && progress < 10)
        {
            DestroyBlockProgress var4 = (DestroyBlockProgress)this.damagedBlocks.get(Integer.valueOf(breakerId));

            if (var4 == null || var4.func_180246_b().getX() != pos.getX() || var4.func_180246_b().getY() != pos.getY() || var4.func_180246_b().getZ() != pos.getZ())
            {
                var4 = new DestroyBlockProgress(breakerId, pos);
                this.damagedBlocks.put(Integer.valueOf(breakerId), var4);
            }

            var4.setPartialBlockDamage(progress);
            var4.setCloudUpdateTick(this.cloudTickCounter);
        }
        else
        {
            this.damagedBlocks.remove(Integer.valueOf(breakerId));
        }
    }

    public void func_174979_m()
    {
        this.displayListEntitiesDirty = true;
    }

    class ContainerLocalRenderInformation
    {
        final RenderChunk field_178036_a;
        final EnumFacing field_178034_b;
        final Set field_178035_c;
        final int field_178032_d;
        private static final String __OBFID = "CL_00002534";

        private ContainerLocalRenderInformation(RenderChunk p_i46248_2_, EnumFacing p_i46248_3_, int p_i46248_4_)
        {
            this.field_178035_c = EnumSet.noneOf(EnumFacing.class);
            this.field_178036_a = p_i46248_2_;
            this.field_178034_b = p_i46248_3_;
            this.field_178032_d = p_i46248_4_;
        }

        ContainerLocalRenderInformation(RenderChunk p_i46249_2_, EnumFacing p_i46249_3_, int p_i46249_4_, Object p_i46249_5_)
        {
            this(p_i46249_2_, p_i46249_3_, p_i46249_4_);
        }
    }

    static final class SwitchEnumUseage
    {
        static final int[] field_178037_a = new int[VertexFormatElement.EnumUseage.values().length];
        private static final String __OBFID = "CL_00002535";

        static
        {
            try
            {
                field_178037_a[VertexFormatElement.EnumUseage.POSITION.ordinal()] = 1;
            }
            catch (NoSuchFieldError var3)
            {
                ;
            }

            try
            {
                field_178037_a[VertexFormatElement.EnumUseage.UV.ordinal()] = 2;
            }
            catch (NoSuchFieldError var2)
            {
                ;
            }

            try
            {
                field_178037_a[VertexFormatElement.EnumUseage.COLOR.ordinal()] = 3;
            }
            catch (NoSuchFieldError var1)
            {
                ;
            }
        }
    }
}
