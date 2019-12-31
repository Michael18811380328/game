package net.minecraft.world.border;

public enum EnumBorderStatus
{
    GROWING(4259712),
    SHRINKING(16724016),
    STATIONARY(2138367);
    private final int id;
    private static final String __OBFID = "CL_00002013";

    private EnumBorderStatus(int id)
    {
        this.id = id;
    }

    public int func_177766_a()
    {
        return this.id;
    }
}
