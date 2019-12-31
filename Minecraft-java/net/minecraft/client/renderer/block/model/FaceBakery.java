package net.minecraft.client.renderer.block.model;

import javax.vecmath.AxisAngle4d;
import javax.vecmath.Matrix4d;
import javax.vecmath.Vector3d;
import javax.vecmath.Vector3f;
import net.minecraft.client.renderer.EnumFaceing;
import net.minecraft.client.renderer.texture.TextureAtlasSprite;
import net.minecraft.client.resources.model.ModelRotation;
import net.minecraft.util.EnumFacing;
import net.minecraft.util.MathHelper;
import net.minecraft.util.Vec3i;

public class FaceBakery
{
    private static final double field_178418_a = 1.0D / Math.cos(0.39269908169872414D) - 1.0D;
    private static final double field_178417_b = 1.0D / Math.cos((Math.PI / 4D)) - 1.0D;
    private static final String __OBFID = "CL_00002490";

    public BakedQuad func_178414_a(Vector3f p_178414_1_, Vector3f p_178414_2_, BlockPartFace p_178414_3_, TextureAtlasSprite p_178414_4_, EnumFacing p_178414_5_, ModelRotation p_178414_6_, BlockPartRotation p_178414_7_, boolean p_178414_8_, boolean p_178414_9_)
    {
        int[] var10 = this.func_178405_a(p_178414_3_, p_178414_4_, p_178414_5_, this.func_178403_a(p_178414_1_, p_178414_2_), p_178414_6_, p_178414_7_, p_178414_8_, p_178414_9_);
        EnumFacing var11 = func_178410_a(var10);

        if (p_178414_8_)
        {
            this.func_178409_a(var10, var11, p_178414_3_.field_178243_e, p_178414_4_);
        }

        if (p_178414_7_ == null)
        {
            this.func_178408_a(var10, var11);
        }

        return new BakedQuad(var10, p_178414_3_.field_178245_c, var11);
    }

    private int[] func_178405_a(BlockPartFace p_178405_1_, TextureAtlasSprite p_178405_2_, EnumFacing p_178405_3_, float[] p_178405_4_, ModelRotation p_178405_5_, BlockPartRotation p_178405_6_, boolean p_178405_7_, boolean p_178405_8_)
    {
        int[] var9 = new int[28];

        for (int var10 = 0; var10 < 4; ++var10)
        {
            this.func_178402_a(var9, var10, p_178405_3_, p_178405_1_, p_178405_4_, p_178405_2_, p_178405_5_, p_178405_6_, p_178405_7_, p_178405_8_);
        }

        return var9;
    }

    private int func_178413_a(EnumFacing p_178413_1_)
    {
        float var2 = this.func_178412_b(p_178413_1_);
        int var3 = MathHelper.clamp_int((int)(var2 * 255.0F), 0, 255);
        return -16777216 | var3 << 16 | var3 << 8 | var3;
    }

    private float func_178412_b(EnumFacing p_178412_1_)
    {
        switch (FaceBakery.SwitchEnumFacing.field_178400_a[p_178412_1_.ordinal()])
        {
            case 1:
                return 0.5F;

            case 2:
                return 1.0F;

            case 3:
            case 4:
                return 0.8F;

            case 5:
            case 6:
                return 0.6F;

            default:
                return 1.0F;
        }
    }

    private float[] func_178403_a(Vector3f p_178403_1_, Vector3f p_178403_2_)
    {
        float[] var3 = new float[EnumFacing.values().length];
        var3[EnumFaceing.Constants.field_179176_f] = p_178403_1_.x / 16.0F;
        var3[EnumFaceing.Constants.field_179178_e] = p_178403_1_.y / 16.0F;
        var3[EnumFaceing.Constants.field_179177_d] = p_178403_1_.z / 16.0F;
        var3[EnumFaceing.Constants.field_179180_c] = p_178403_2_.x / 16.0F;
        var3[EnumFaceing.Constants.field_179179_b] = p_178403_2_.y / 16.0F;
        var3[EnumFaceing.Constants.field_179181_a] = p_178403_2_.z / 16.0F;
        return var3;
    }

    private void func_178402_a(int[] p_178402_1_, int p_178402_2_, EnumFacing p_178402_3_, BlockPartFace p_178402_4_, float[] p_178402_5_, TextureAtlasSprite p_178402_6_, ModelRotation p_178402_7_, BlockPartRotation p_178402_8_, boolean p_178402_9_, boolean p_178402_10_)
    {
        EnumFacing var11 = p_178402_7_.func_177523_a(p_178402_3_);
        int var12 = p_178402_10_ ? this.func_178413_a(var11) : -1;
        EnumFaceing.VertexInformation var13 = EnumFaceing.func_179027_a(p_178402_3_).func_179025_a(p_178402_2_);
        Vector3d var14 = new Vector3d((double)p_178402_5_[var13.field_179184_a], (double)p_178402_5_[var13.field_179182_b], (double)p_178402_5_[var13.field_179183_c]);
        this.func_178407_a(var14, p_178402_8_);
        int var15 = this.func_178415_a(var14, p_178402_3_, p_178402_2_, p_178402_7_, p_178402_9_);
        this.func_178404_a(p_178402_1_, var15, p_178402_2_, var14, var12, p_178402_6_, p_178402_4_.field_178243_e);
    }

    private void func_178404_a(int[] p_178404_1_, int p_178404_2_, int p_178404_3_, Vector3d p_178404_4_, int p_178404_5_, TextureAtlasSprite p_178404_6_, BlockFaceUV p_178404_7_)
    {
        int var8 = p_178404_2_ * 7;
        p_178404_1_[var8] = Float.floatToRawIntBits((float)p_178404_4_.x);
        p_178404_1_[var8 + 1] = Float.floatToRawIntBits((float)p_178404_4_.y);
        p_178404_1_[var8 + 2] = Float.floatToRawIntBits((float)p_178404_4_.z);
        p_178404_1_[var8 + 3] = p_178404_5_;
        p_178404_1_[var8 + 4] = Float.floatToRawIntBits(p_178404_6_.getInterpolatedU((double)p_178404_7_.func_178348_a(p_178404_3_)));
        p_178404_1_[var8 + 4 + 1] = Float.floatToRawIntBits(p_178404_6_.getInterpolatedV((double)p_178404_7_.func_178346_b(p_178404_3_)));
    }

    private void func_178407_a(Vector3d p_178407_1_, BlockPartRotation p_178407_2_)
    {
        if (p_178407_2_ != null)
        {
            Matrix4d var3 = this.func_178411_a();
            Vector3d var4 = new Vector3d(0.0D, 0.0D, 0.0D);

            switch (FaceBakery.SwitchEnumFacing.field_178399_b[p_178407_2_.field_178342_b.ordinal()])
            {
                case 1:
                    var3.mul(this.func_178416_a(new AxisAngle4d(1.0D, 0.0D, 0.0D, (double)p_178407_2_.field_178343_c * 0.017453292519943295D)));
                    var4.set(0.0D, 1.0D, 1.0D);
                    break;

                case 2:
                    var3.mul(this.func_178416_a(new AxisAngle4d(0.0D, 1.0D, 0.0D, (double)p_178407_2_.field_178343_c * 0.017453292519943295D)));
                    var4.set(1.0D, 0.0D, 1.0D);
                    break;

                case 3:
                    var3.mul(this.func_178416_a(new AxisAngle4d(0.0D, 0.0D, 1.0D, (double)p_178407_2_.field_178343_c * 0.017453292519943295D)));
                    var4.set(1.0D, 1.0D, 0.0D);
            }

            if (p_178407_2_.field_178341_d)
            {
                if (Math.abs(p_178407_2_.field_178343_c) == 22.5F)
                {
                    var4.scale(field_178418_a);
                }
                else
                {
                    var4.scale(field_178417_b);
                }

                var4.add(new Vector3d(1.0D, 1.0D, 1.0D));
            }
            else
            {
                var4.set(new Vector3d(1.0D, 1.0D, 1.0D));
            }

            this.func_178406_a(p_178407_1_, new Vector3d(p_178407_2_.field_178344_a), var3, var4);
        }
    }

    public int func_178415_a(Vector3d p_178415_1_, EnumFacing p_178415_2_, int p_178415_3_, ModelRotation p_178415_4_, boolean p_178415_5_)
    {
        if (p_178415_4_ == ModelRotation.X0_Y0)
        {
            return p_178415_3_;
        }
        else
        {
            this.func_178406_a(p_178415_1_, new Vector3d(0.5D, 0.5D, 0.5D), p_178415_4_.func_177525_a(), new Vector3d(1.0D, 1.0D, 1.0D));
            return p_178415_4_.func_177520_a(p_178415_2_, p_178415_3_);
        }
    }

    private void func_178406_a(Vector3d p_178406_1_, Vector3d p_178406_2_, Matrix4d p_178406_3_, Vector3d p_178406_4_)
    {
        p_178406_1_.sub(p_178406_2_);
        p_178406_3_.transform(p_178406_1_);
        p_178406_1_.x *= p_178406_4_.x;
        p_178406_1_.y *= p_178406_4_.y;
        p_178406_1_.z *= p_178406_4_.z;
        p_178406_1_.add(p_178406_2_);
    }

    private Matrix4d func_178416_a(AxisAngle4d p_178416_1_)
    {
        Matrix4d var2 = this.func_178411_a();
        var2.setRotation(p_178416_1_);
        return var2;
    }

    private Matrix4d func_178411_a()
    {
        Matrix4d var1 = new Matrix4d();
        var1.setIdentity();
        return var1;
    }

    public static EnumFacing func_178410_a(int[] p_178410_0_)
    {
        Vector3f var1 = new Vector3f(Float.intBitsToFloat(p_178410_0_[0]), Float.intBitsToFloat(p_178410_0_[1]), Float.intBitsToFloat(p_178410_0_[2]));
        Vector3f var2 = new Vector3f(Float.intBitsToFloat(p_178410_0_[7]), Float.intBitsToFloat(p_178410_0_[8]), Float.intBitsToFloat(p_178410_0_[9]));
        Vector3f var3 = new Vector3f(Float.intBitsToFloat(p_178410_0_[14]), Float.intBitsToFloat(p_178410_0_[15]), Float.intBitsToFloat(p_178410_0_[16]));
        Vector3f var4 = new Vector3f();
        Vector3f var5 = new Vector3f();
        Vector3f var6 = new Vector3f();
        var4.sub(var1, var2);
        var5.sub(var3, var2);
        var6.cross(var5, var4);
        var6.normalize();
        EnumFacing var7 = null;
        float var8 = 0.0F;
        EnumFacing[] var9 = EnumFacing.values();
        int var10 = var9.length;

        for (int var11 = 0; var11 < var10; ++var11)
        {
            EnumFacing var12 = var9[var11];
            Vec3i var13 = var12.getDirectionVec();
            Vector3f var14 = new Vector3f((float)var13.getX(), (float)var13.getY(), (float)var13.getZ());
            float var15 = var6.dot(var14);

            if (var15 >= 0.0F && var15 > var8)
            {
                var8 = var15;
                var7 = var12;
            }
        }

        if (var7 == null)
        {
            return EnumFacing.UP;
        }
        else
        {
            return var7;
        }
    }

    public void func_178409_a(int[] p_178409_1_, EnumFacing p_178409_2_, BlockFaceUV p_178409_3_, TextureAtlasSprite p_178409_4_)
    {
        for (int var5 = 0; var5 < 4; ++var5)
        {
            this.func_178401_a(var5, p_178409_1_, p_178409_2_, p_178409_3_, p_178409_4_);
        }
    }

    private void func_178408_a(int[] p_178408_1_, EnumFacing p_178408_2_)
    {
        int[] var3 = new int[p_178408_1_.length];
        System.arraycopy(p_178408_1_, 0, var3, 0, p_178408_1_.length);
        float[] var4 = new float[EnumFacing.values().length];
        var4[EnumFaceing.Constants.field_179176_f] = 999.0F;
        var4[EnumFaceing.Constants.field_179178_e] = 999.0F;
        var4[EnumFaceing.Constants.field_179177_d] = 999.0F;
        var4[EnumFaceing.Constants.field_179180_c] = -999.0F;
        var4[EnumFaceing.Constants.field_179179_b] = -999.0F;
        var4[EnumFaceing.Constants.field_179181_a] = -999.0F;
        int var6;
        float var9;

        for (int var5 = 0; var5 < 4; ++var5)
        {
            var6 = 7 * var5;
            float var7 = Float.intBitsToFloat(var3[var6]);
            float var8 = Float.intBitsToFloat(var3[var6 + 1]);
            var9 = Float.intBitsToFloat(var3[var6 + 2]);

            if (var7 < var4[EnumFaceing.Constants.field_179176_f])
            {
                var4[EnumFaceing.Constants.field_179176_f] = var7;
            }

            if (var8 < var4[EnumFaceing.Constants.field_179178_e])
            {
                var4[EnumFaceing.Constants.field_179178_e] = var8;
            }

            if (var9 < var4[EnumFaceing.Constants.field_179177_d])
            {
                var4[EnumFaceing.Constants.field_179177_d] = var9;
            }

            if (var7 > var4[EnumFaceing.Constants.field_179180_c])
            {
                var4[EnumFaceing.Constants.field_179180_c] = var7;
            }

            if (var8 > var4[EnumFaceing.Constants.field_179179_b])
            {
                var4[EnumFaceing.Constants.field_179179_b] = var8;
            }

            if (var9 > var4[EnumFaceing.Constants.field_179181_a])
            {
                var4[EnumFaceing.Constants.field_179181_a] = var9;
            }
        }

        EnumFaceing var17 = EnumFaceing.func_179027_a(p_178408_2_);

        for (var6 = 0; var6 < 4; ++var6)
        {
            int var18 = 7 * var6;
            EnumFaceing.VertexInformation var19 = var17.func_179025_a(var6);
            var9 = var4[var19.field_179184_a];
            float var10 = var4[var19.field_179182_b];
            float var11 = var4[var19.field_179183_c];
            p_178408_1_[var18] = Float.floatToRawIntBits(var9);
            p_178408_1_[var18 + 1] = Float.floatToRawIntBits(var10);
            p_178408_1_[var18 + 2] = Float.floatToRawIntBits(var11);

            for (int var12 = 0; var12 < 4; ++var12)
            {
                int var13 = 7 * var12;
                float var14 = Float.intBitsToFloat(var3[var13]);
                float var15 = Float.intBitsToFloat(var3[var13 + 1]);
                float var16 = Float.intBitsToFloat(var3[var13 + 2]);

                if (MathHelper.func_180185_a(var9, var14) && MathHelper.func_180185_a(var10, var15) && MathHelper.func_180185_a(var11, var16))
                {
                    p_178408_1_[var18 + 4] = var3[var13 + 4];
                    p_178408_1_[var18 + 4 + 1] = var3[var13 + 4 + 1];
                }
            }
        }
    }

    private void func_178401_a(int p_178401_1_, int[] p_178401_2_, EnumFacing p_178401_3_, BlockFaceUV p_178401_4_, TextureAtlasSprite p_178401_5_)
    {
        int var6 = 7 * p_178401_1_;
        float var7 = Float.intBitsToFloat(p_178401_2_[var6]);
        float var8 = Float.intBitsToFloat(p_178401_2_[var6 + 1]);
        float var9 = Float.intBitsToFloat(p_178401_2_[var6 + 2]);

        if (var7 < -0.1F || var7 >= 1.1F)
        {
            var7 -= (float)MathHelper.floor_float(var7);
        }

        if (var8 < -0.1F || var8 >= 1.1F)
        {
            var8 -= (float)MathHelper.floor_float(var8);
        }

        if (var9 < -0.1F || var9 >= 1.1F)
        {
            var9 -= (float)MathHelper.floor_float(var9);
        }

        float var10 = 0.0F;
        float var11 = 0.0F;

        switch (FaceBakery.SwitchEnumFacing.field_178400_a[p_178401_3_.ordinal()])
        {
            case 1:
                var10 = var7 * 16.0F;
                var11 = (1.0F - var9) * 16.0F;
                break;

            case 2:
                var10 = var7 * 16.0F;
                var11 = var9 * 16.0F;
                break;

            case 3:
                var10 = (1.0F - var7) * 16.0F;
                var11 = (1.0F - var8) * 16.0F;
                break;

            case 4:
                var10 = var7 * 16.0F;
                var11 = (1.0F - var8) * 16.0F;
                break;

            case 5:
                var10 = var9 * 16.0F;
                var11 = (1.0F - var8) * 16.0F;
                break;

            case 6:
                var10 = (1.0F - var9) * 16.0F;
                var11 = (1.0F - var8) * 16.0F;
        }

        int var12 = p_178401_4_.func_178345_c(p_178401_1_) * 7;
        p_178401_2_[var12 + 4] = Float.floatToRawIntBits(p_178401_5_.getInterpolatedU((double)var10));
        p_178401_2_[var12 + 4 + 1] = Float.floatToRawIntBits(p_178401_5_.getInterpolatedV((double)var11));
    }

    static final class SwitchEnumFacing
    {
        static final int[] field_178400_a;

        static final int[] field_178399_b = new int[EnumFacing.Axis.values().length];
        private static final String __OBFID = "CL_00002489";

        static
        {
            try
            {
                field_178399_b[EnumFacing.Axis.X.ordinal()] = 1;
            }
            catch (NoSuchFieldError var9)
            {
                ;
            }

            try
            {
                field_178399_b[EnumFacing.Axis.Y.ordinal()] = 2;
            }
            catch (NoSuchFieldError var8)
            {
                ;
            }

            try
            {
                field_178399_b[EnumFacing.Axis.Z.ordinal()] = 3;
            }
            catch (NoSuchFieldError var7)
            {
                ;
            }

            field_178400_a = new int[EnumFacing.values().length];

            try
            {
                field_178400_a[EnumFacing.DOWN.ordinal()] = 1;
            }
            catch (NoSuchFieldError var6)
            {
                ;
            }

            try
            {
                field_178400_a[EnumFacing.UP.ordinal()] = 2;
            }
            catch (NoSuchFieldError var5)
            {
                ;
            }

            try
            {
                field_178400_a[EnumFacing.NORTH.ordinal()] = 3;
            }
            catch (NoSuchFieldError var4)
            {
                ;
            }

            try
            {
                field_178400_a[EnumFacing.SOUTH.ordinal()] = 4;
            }
            catch (NoSuchFieldError var3)
            {
                ;
            }

            try
            {
                field_178400_a[EnumFacing.WEST.ordinal()] = 5;
            }
            catch (NoSuchFieldError var2)
            {
                ;
            }

            try
            {
                field_178400_a[EnumFacing.EAST.ordinal()] = 6;
            }
            catch (NoSuchFieldError var1)
            {
                ;
            }
        }
    }
}
