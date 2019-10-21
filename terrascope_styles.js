/**
 * Created by donat050 on 2/19/16.
 */


var appEnv = "";
var appEnvSettings = {
    localhost: {
        workspace: "sgl_testing",
        version : '1.0.0'
    },
    demo: {
        workspace: "sgl_demo",
        version : '1.0.0'
    },
    data:{
        workspace: "sgl_data",
        version: "1.0.0"
    },
    internal:{
        workspace: "sgl_internal",
        version: "1.0.0"
    },
    staging:{
        workspace: "sgl_staging",
        version: "1.0.0"
    }
}

//var geoserver_url = 'https://geoserver.terrapop.org/geoserver';
var geoserver_url = "https://geoserver3.pop.umn.edu/geoserver";

//var raster_url = "https://geoserver.terrapop.org/geoserver/[workspace]/wms?service=WMS";
var raster_url = "https://geoserver3.pop.umn.edu/geoserver/[workspace]/wms?service=WMS";

// var map = "";
// var mapCenter = [0, 20];

//var default_sgl_order = [2,6,11,3,7,12,4,8,13,1,10];
var sgl_sort_order = ["NAT", "FLAD", "SLAD", "TLAD", "HFLAD", "HSLAD", "HTLAD"];

var id_da = "data_availability";

var fil_available = new ol.style.Fill({color: 'rgba(255,255,255,0)'});
var stk_available = new ol.style.Stroke({color: 'rgba(0,0,0,1)', width: 1});
var stl_available = new ol.style.Style({fill: fil_available, stroke: stk_available});

//  not available boundary style
var fil_not_available = new ol.style.Fill({color: 'rgba(255,255,255,0)'});
var stk_not_available = new ol.style.Stroke({color: 'rgba(0,0,0,1)', width: 1});
var stl_not_available = new ol.style.Style({fill: fil_not_available, stroke: stk_not_available});

//  invisible boundary style
var fil_invisible = new ol.style.Fill({color: 'rgba(255,255,255,0)'});
var stk_invisible = new ol.style.Stroke({color: 'rgba(255,255,255,0)', width: 1});
var stl_invisible = new ol.style.Style({fill: fil_invisible, stroke: stk_invisible});

//  no data boundary style
var clr_no_data = 'rgb(316,77,98)';
var fil_no_data = new ol.style.Fill({color: clr_no_data});
var stk_no_data = new ol.style.Stroke({color: 'rgba(255,255,255,1)', width: 1});
var stl_no_data = new ol.style.Style({fill: fil_no_data, stroke: stk_no_data});

//  selected boundary style
var fil_selected = new ol.style.Fill({color: '#f03b20'});
var stk_selected = new ol.style.Stroke({color: 'rgba(0,0,0,1)', width: 2});
var stl_selected = new ol.style.Style({fill: fil_selected, stroke: stk_selected});

//  hollow style
var clr_hollow = 'rgba(255, 255,  255, 0)';
var fil_hollow = new ol.style.Fill({color: clr_hollow});
var stk_hollow = new ol.style.Stroke({color: "#000000", width: 1});
var stl_hollow = new ol.style.Style({fill: fil_hollow, stroke: stk_hollow});

var style_continuous_raster_default = 'tp_stretch_2';
var wms_version = '1.1.0';

var stretch_styles = {
    '2': 'tp_stretch_2',
    '3': 'tp_stretch_3',
    '4': 'tp_stretch_4',
    '5': 'tp_stretch_5',
    '6': 'tp_stretch_6',
    '7': 'tp_stretch_7',
    '8': 'tp_stretch_8',
    '9': 'tp_stretch_9'
};

var interval_styles = {
    '1': 'tp_intervals_1',
    '2': 'tp_intervals_2',
    '3': 'tp_intervals_3',
    '4': 'tp_intervals_4',
    '5': 'tp_intervals_5',
    '6': 'tp_intervals_6',
    '7': 'tp_intervals_7',
    '8': 'tp_intervals_8',
    '9': 'tp_intervals_9'
};

var cnt = 0;
var tot = 13;

var sgl_countries_zoom_lyrs = {
    0: 'sgl_countries_view_0',
    1: 'sgl_countries_view_1',
    2: 'sgl_countries_view_2',
    3: 'sgl_countries_view_3'
};

var sgl_boundaries_zoom_lyrs = {
    0: 'sgl_boundaries_view_0',
    1: 'sgl_boundaries_view_1',
    2: 'sgl_boundaries_view_2',
    3: 'sgl_boundaries_view_3'
};

var data_zoom_levels = {
    2: 3,
    3: 3,
    4: 3,
    5: 2,
    6: 2,
    7: 1,
    8: 1,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    21: 0,
    22: 0,
    23: 0
};

var baselayers = {
    none: {
        id: "none",
        text: "None",
        name_map: null,
        url_map: null,
        ol_map_source_type: null,
        attribution: null,
        url_labels: null,
        name_labels: null,
        ol_labels_source_type: null
    },
    //cartodb_dark_no_labels: {
    //    text: "CartoDB Dark Matter",
    //    name_map: 'CartoDB Dark Matter',
    //    url_map: 'http://s.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
    //    ol_map_source_type: 'ol.source.XYZ',
    //    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    //    url_labels: null,
    //    name_labels: null,
    //    ol_labels_source_type: null
    //},
    //cartodb_dark_with_labels: {
    //    text: "CartoDB Dark Matter with labels",
    //    name_map: "CartoDB Dark Matter",
    //    url_map: 'http://s.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
    //    ol_map_source_type: 'ol.source.XYZ',
    //    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    //    url_labels: "http://s.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png",
    //    ol_labels_source_type: 'ol.source.XYZ',
    //    name_labels: "CartoDB_Dark_Matter_Labels"
    //},
    //cartodb_light_no_labels: {
    //    text: "CartoDB Positron",
    //    url_map: "http://s.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
    //    ol_map_source_type: 'ol.source.XYZ',
    //    name_map: "CartoDB Positron",
    //    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    //    url_labels: null,
    //    name_labels: null,
    //    ol_labels_source_type: null
    //},
    //cartodb_light_with_labels: {
    //    text: "CartoDB Positron with labels",
    //    url_map: "http://s.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
    //    ol_map_source_type: 'ol.source.XYZ',
    //    name_map: "CartoDB Positron",
    //    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    //    url_labels: "http://s.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
    //    ol_labels_source_type: 'ol.source.XYZ',
    //    name_labels: "CartoDB_Positron_Labels"
    //},
    esri_light_gray: {
        id: "esri_light_gray",
        text: "ESRI Light Gray",
        url_map: "//services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer",
        ol_map_source_type: 'ol.source.TileArcGISRest',
        name_map: "ESRI Light Gray",
        attribution: '&copy; <a href="http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer">ESRI Light Gray Canvas</a>',
        url_labels: null,
        name_labels: null,
        ol_labels_source_type: null
    },
    esri_dark_gray: {
        id: "esri_dark_gray",
        text: "ESRI Dark Gray",
        url_map: "//services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer",
        ol_map_source_type: 'ol.source.TileArcGISRest',
        name_map: "ESRI Dark Gray",
        attribution: '&copy; <a href="http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer">ESRI Dark Gray Canvas</a>',
        url_labels: null,
        name_labels: null,
        ol_labels_source_type: null
    },
    esri_world_imagery: {
        id: "esri_world_imagery",
        text: "ESRI World Imagery",
        url_map: "//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        ol_map_source_type: 'ol.source.TileArcGISRest',
        name_map: "ESRI World Imagery",
        attribution: '&copy; <a href="http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ESRI World Imagery</a>',
        url_labels: null,
        name_labels: null,
        ol_labels_source_type: null
    }
};

var terrapop_glc2000_group_colors = {
    LCNONVEGAQ: "#3366ff",
    LCGRSSHRB: "#00B300",
    LCMXAGNAT: "#CDCD66",
    LCVEGAQNAT: "#AAF0F0",
    LCVEGNAT: "#DCF064",
    LCPRIMVEG: "#8CA000",
    LCNONVEG: "#FFEBAF",
    LCNONVEGTER: "#009678",
    LCVEGTERR: "#00DC82",
    LCTREECOV: "#009933"
};


