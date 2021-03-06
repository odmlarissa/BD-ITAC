package br.ita.bditac.mobile.alertas;


public interface Constants {

    public static final int DEFAULT_TIMER = 15000;

    public static final int DEBUG_TIMER = 15000;

    public static final String DEFAULT_URL = "http://200.144.14.28/rest";
    //public static final String DEFAULT_URL = "http://10.0.2.2:8081";

    public static final String DEBUG_URL = "http://200.144.14.28/rest";
    //public static final String DEBUG_URL = "http://10.0.2.2:8081";

    public static final String DEFAULT_RADIUS_KMS = "10";

    public static final double DEBUG_RADIUS_KMS = 100;

    public static final int DEFAULT_LOCATION_POLLING_INTERVAL = 120000;

    public static final int DEBUG_LOCATION_POLLING_INTERVAL = 15000;

    public static final int REQUEST_CODE_INTERNET = 100;

    public static final int REQUEST_CODE_ACCESS_FINE_LOCATION = 200;

    public static final int REQUEST_CODE_WRITE_EXTERNAL_STORAGE = 300;

    public static final String EXTRA_NOTIFICATION_LATITUDE = "br.ita.bditac.EXTRA_LATITUDE";

    public static final String EXTRA_NOTIFICATION_LONGITUDE = "br.ita.bditac.EXTRA_LONGITUDE";

    public static final String EXTRA_NOTIFICATION_RAIO = "br.ita.bditac.EXTRA_RAIO";

    public static final String EXTRA_NOTIFICATION_ALERTA = "br.ita.bditac.EXTRA_ALERTA";

    public static final String EXTRA_NOTIFICATION_DESCRICAO = "br.ita.bditac.EXTRA_DESCRICAO";

    public static final double DEFAULT_NOTIFICATION_LATITUDE = -23.2094559;

    public static final double DEFAULT_NOTIFICATION_LONGITUDE = -45.8745047;

    public static final double DEFAULT_NOTIFICATION_RAIO = 10;

}
