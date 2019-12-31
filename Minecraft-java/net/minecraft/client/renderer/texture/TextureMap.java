package net.minecraft.client.renderer.texture;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.Callable;
import net.minecraft.client.Minecraft;
import net.minecraft.client.renderer.StitcherException;
import net.minecraft.client.resources.IResource;
import net.minecraft.client.resources.IResourceManager;
import net.minecraft.client.resources.data.AnimationMetadataSection;
import net.minecraft.client.resources.data.TextureMetadataSection;
import net.minecraft.crash.CrashReport;
import net.minecraft.crash.CrashReportCategory;
import net.minecraft.util.MathHelper;
import net.minecraft.util.ReportedException;
import net.minecraft.util.ResourceLocation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class TextureMap extends AbstractTexture implements ITickableTextureObject
{
    private static final Logger logger = LogManager.getLogger();
    public static final ResourceLocation field_174945_f = new ResourceLocation("missingno");
    public static final ResourceLocation locationBlocksTexture = new ResourceLocation("textures/atlas/blocks.png");
    private final List listAnimatedSprites;
    private final Map mapRegisteredSprites;
    private final Map mapUploadedSprites;
    private final String basePath;
    private final IIconCreator field_174946_m;
    private int mipmapLevels;
    private final TextureAtlasSprite missingImage;
    private static final String __OBFID = "CL_00001058";

    public TextureMap(String p_i46099_1_)
    {
        this(p_i46099_1_, (IIconCreator)null);
    }

    public TextureMap(String p_i46100_1_, IIconCreator p_i46100_2_)
    {
        this.listAnimatedSprites = Lists.newArrayList();
        this.mapRegisteredSprites = Maps.newHashMap();
        this.mapUploadedSprites = Maps.newHashMap();
        this.missingImage = new TextureAtlasSprite("missingno");
        this.basePath = p_i46100_1_;
        this.field_174946_m = p_i46100_2_;
    }

    private void initMissingImage()
    {
        int[] var1 = TextureUtil.missingTextureData;
        this.missingImage.setIconWidth(16);
        this.missingImage.setIconHeight(16);
        int[][] var2 = new int[this.mipmapLevels + 1][];
        var2[0] = var1;
        this.missingImage.setFramesTextureData(Lists.newArrayList(new int[][][] {var2}));
    }

    public void loadTexture(IResourceManager p_110551_1_) throws IOException
    {
        if (this.field_174946_m != null)
        {
            this.func_174943_a(p_110551_1_, this.field_174946_m);
        }
    }

    public void func_174943_a(IResourceManager p_174943_1_, IIconCreator p_174943_2_)
    {
        this.mapRegisteredSprites.clear();
        p_174943_2_.func_177059_a(this);
        this.initMissingImage();
        this.deleteGlTexture();
        this.loadTextureAtlas(p_174943_1_);
    }

    public void loadTextureAtlas(IResourceManager p_110571_1_)
    {
        int var2 = Minecraft.getGLMaximumTextureSize();
        Stitcher var3 = new Stitcher(var2, var2, true, 0, this.mipmapLevels);
        this.mapUploadedSprites.clear();
        this.listAnimatedSprites.clear();
        int var4 = Integer.MAX_VALUE;
        int var5 = 1 << this.mipmapLevels;
        Iterator var6 = this.mapRegisteredSprites.entrySet().iterator();

        while (var6.hasNext())
        {
            Entry var7 = (Entry)var6.next();
            TextureAtlasSprite var8 = (TextureAtlasSprite)var7.getValue();
            ResourceLocation var9 = new ResourceLocation(var8.getIconName());
            ResourceLocation var10 = this.completeResourceLocation(var9, 0);

            try
            {
                IResource var11 = p_110571_1_.getResource(var10);
                BufferedImage[] var12 = new BufferedImage[1 + this.mipmapLevels];
                var12[0] = TextureUtil.func_177053_a(var11.getInputStream());
                TextureMetadataSection var13 = (TextureMetadataSection)var11.getMetadata("texture");

                if (var13 != null)
                {
                    List var14 = var13.getListMipmaps();
                    int var16;

                    if (!var14.isEmpty())
                    {
                        int var15 = var12[0].getWidth();
                        var16 = var12[0].getHeight();

                        if (MathHelper.roundUpToPowerOfTwo(var15) != var15 || MathHelper.roundUpToPowerOfTwo(var16) != var16)
                        {
                            throw new RuntimeException("Unable to load extra miplevels, source-texture is not power of two");
                        }
                    }

                    Iterator var39 = var14.iterator();

                    while (var39.hasNext())
                    {
                        var16 = ((Integer)var39.next()).intValue();

                        if (var16 > 0 && var16 < var12.length - 1 && var12[var16] == null)
                        {
                            ResourceLocation var17 = this.completeResourceLocation(var9, var16);

                            try
                            {
                                var12[var16] = TextureUtil.func_177053_a(p_110571_1_.getResource(var17).getInputStream());
                            }
                            catch (IOException var22)
                            {
                                logger.error("Unable to load miplevel {} from: {}", new Object[] {Integer.valueOf(var16), var17, var22});
                            }
                        }
                    }
                }

                AnimationMetadataSection var37 = (AnimationMetadataSection)var11.getMetadata("animation");
                var8.func_180598_a(var12, var37);
            }
            catch (RuntimeException var23)
            {
                logger.error("Unable to parse metadata from " + var10, var23);
                continue;
            }
            catch (IOException var24)
            {
                logger.error("Using missing texture, unable to load " + var10, var24);
                continue;
            }

            var4 = Math.min(var4, Math.min(var8.getIconWidth(), var8.getIconHeight()));
            int var32 = Math.min(Integer.lowestOneBit(var8.getIconWidth()), Integer.lowestOneBit(var8.getIconHeight()));

            if (var32 < var5)
            {
                logger.warn("Texture {} with size {}x{} limits mip level from {} to {}", new Object[] {var10, Integer.valueOf(var8.getIconWidth()), Integer.valueOf(var8.getIconHeight()), Integer.valueOf(MathHelper.calculateLogBaseTwo(var5)), Integer.valueOf(MathHelper.calculateLogBaseTwo(var32))});
                var5 = var32;
            }

            var3.addSprite(var8);
        }

        int var25 = Math.min(var4, var5);
        int var26 = MathHelper.calculateLogBaseTwo(var25);

        if (var26 < this.mipmapLevels)
        {
            logger.debug("{}: dropping miplevel from {} to {}, because of minimum power of two: {}", new Object[] {this.basePath, Integer.valueOf(this.mipmapLevels), Integer.valueOf(var26), Integer.valueOf(var25)});
            this.mipmapLevels = var26;
        }

        Iterator var27 = this.mapRegisteredSprites.values().iterator();

        while (var27.hasNext())
        {
            final TextureAtlasSprite var29 = (TextureAtlasSprite)var27.next();

            try
            {
                var29.generateMipmaps(this.mipmapLevels);
            }
            catch (Throwable var21)
            {
                CrashReport var33 = CrashReport.makeCrashReport(var21, "Applying mipmap");
                CrashReportCategory var35 = var33.makeCategory("Sprite being mipmapped");
                var35.addCrashSectionCallable("Sprite name", new Callable()
                {
                    private static final String __OBFID = "CL_00001059";
                    public String call()
                    {
                        return var29.getIconName();
                    }
                });
                var35.addCrashSectionCallable("Sprite size", new Callable()
                {
                    private static final String __OBFID = "CL_00001060";
                    public String call()
                    {
                        return var29.getIconWidth() + " x " + var29.getIconHeight();
                    }
                });
                var35.addCrashSectionCallable("Sprite frames", new Callable()
                {
                    private static final String __OBFID = "CL_00001061";
                    public String call()
                    {
                        return var29.getFrameCount() + " frames";
                    }
                });
                var35.addCrashSection("Mipmap levels", Integer.valueOf(this.mipmapLevels));
                throw new ReportedException(var33);
            }
        }

        this.missingImage.generateMipmaps(this.mipmapLevels);
        var3.addSprite(this.missingImage);

        try
        {
            var3.doStitch();
        }
        catch (StitcherException var20)
        {
            throw var20;
        }

        logger.info("Created: {}x{} {}-atlas", new Object[] {Integer.valueOf(var3.getCurrentWidth()), Integer.valueOf(var3.getCurrentHeight()), this.basePath});
        TextureUtil.func_180600_a(this.getGlTextureId(), this.mipmapLevels, var3.getCurrentWidth(), var3.getCurrentHeight());
        HashMap var28 = Maps.newHashMap(this.mapRegisteredSprites);
        Iterator var30 = var3.getStichSlots().iterator();
        TextureAtlasSprite var31;

        while (var30.hasNext())
        {
            var31 = (TextureAtlasSprite)var30.next();
            String var34 = var31.getIconName();
            var28.remove(var34);
            this.mapUploadedSprites.put(var34, var31);

            try
            {
                TextureUtil.uploadTextureMipmap(var31.getFrameTextureData(0), var31.getIconWidth(), var31.getIconHeight(), var31.getOriginX(), var31.getOriginY(), false, false);
            }
            catch (Throwable var19)
            {
                CrashReport var36 = CrashReport.makeCrashReport(var19, "Stitching texture atlas");
                CrashReportCategory var38 = var36.makeCategory("Texture being stitched together");
                var38.addCrashSection("Atlas path", this.basePath);
                var38.addCrashSection("Sprite", var31);
                throw new ReportedException(var36);
            }

            if (var31.hasAnimationMetadata())
            {
                this.listAnimatedSprites.add(var31);
            }
        }

        var30 = var28.values().iterator();

        while (var30.hasNext())
        {
            var31 = (TextureAtlasSprite)var30.next();
            var31.copyFrom(this.missingImage);
        }

        TextureUtil.func_177055_a(this.basePath.replaceAll("/", "_"), this.getGlTextureId(), this.mipmapLevels, var3.getCurrentWidth(), var3.getCurrentHeight());
    }

    private ResourceLocation completeResourceLocation(ResourceLocation p_147634_1_, int p_147634_2_)
    {
        return p_147634_2_ == 0 ? new ResourceLocation(p_147634_1_.getResourceDomain(), String.format("%s/%s%s", new Object[] {this.basePath, p_147634_1_.getResourcePath(), ".png"})): new ResourceLocation(p_147634_1_.getResourceDomain(), String.format("%s/mipmaps/%s.%d%s", new Object[] {this.basePath, p_147634_1_.getResourcePath(), Integer.valueOf(p_147634_2_), ".png"}));
    }

    public TextureAtlasSprite getAtlasSprite(String p_110572_1_)
    {
        TextureAtlasSprite var2 = (TextureAtlasSprite)this.mapUploadedSprites.get(p_110572_1_);

        if (var2 == null)
        {
            var2 = this.missingImage;
        }

        return var2;
    }

    public void updateAnimations()
    {
        TextureUtil.bindTexture(this.getGlTextureId());
        Iterator var1 = this.listAnimatedSprites.iterator();

        while (var1.hasNext())
        {
            TextureAtlasSprite var2 = (TextureAtlasSprite)var1.next();
            var2.updateAnimation();
        }
    }

    public TextureAtlasSprite func_174942_a(ResourceLocation p_174942_1_)
    {
        if (p_174942_1_ == null)
        {
            throw new IllegalArgumentException("Location cannot be null!");
        }
        else
        {
            TextureAtlasSprite var2 = (TextureAtlasSprite)this.mapRegisteredSprites.get(p_174942_1_);

            if (var2 == null)
            {
                var2 = TextureAtlasSprite.func_176604_a(p_174942_1_);
                this.mapRegisteredSprites.put(p_174942_1_.toString(), var2);
            }

            return var2;
        }
    }

    public void tick()
    {
        this.updateAnimations();
    }

    public void setMipmapLevels(int p_147633_1_)
    {
        this.mipmapLevels = p_147633_1_;
    }

    public TextureAtlasSprite func_174944_f()
    {
        return this.missingImage;
    }
}
