package net.ideaslibres.rhdstore.model;

public class Constants {
    public static final String ROLE_ADMIN = "admin";
    public static final String ROLE_CLIENT = "client";

    public static final String CAT_2BY2 = "2x2";
    public static final String CAT_3BY3 = "3x3";
    public static final String CAT_4BY4 = "4x4";
    public static final String CAT_5BY5 = "5x5";
    public static final String CAT_6BY6 = "6x6";
    public static final String CAT_7BY7 = "7x7";
    public static final String CAT_8BY8 = "8x8";
    public static final String CAT_MBYN = "MxN";
    public static final String CAT_NBYN = "NxN";
    public static final String CAT_OTHER = "other";

    public static final String ORDER_PLACED = "placed";
    public static final String ORDER_CLIENT_CANCELLED = "client-cancelled";
    public static final String ORDER_ADMIN_CANCELLED = "admin-cancelled";
    public static final String ORDER_PURCHASED = "purchased";
    public static final String ORDER_DELIVERED = "delivered";
    public static final String ORDER_COMPLETED = "completed";

    public static final String[] ITEMS_ORDERABLE_COLUMNS =
            new String[]{"price", "name", "category", "creationTimestamp"};
    public static final String DATE_TIME_FORMAT = "yyyy/MM/dd";
}
