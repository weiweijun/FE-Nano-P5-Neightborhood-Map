/**
 * Created by tianhengzhou on 12/4/15.
 */
var mkr,
    mapMarkers = [];
function mapInit() {
    var myLatlng = new google.maps.LatLng(37.352886, -122.012384);
    var mapOptions = {
        zoom: 12,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER
        }
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
    addMapMark(myLatlng, 200, map);
    map.addListener('click',function(){
        window.setTimeout(function() {
            $('#mark_info').removeClass('show')
        }, 600);
        $('#yelp_list').find('li').removeClass('active');
        mapMarkers.forEach(function(marker){
            marker.setAnimation(null);
        })
    });
    return yelpSearch('94087', 'Chinese', map)
}

function addMapMark(position, timeout, map, i) {
    window.setTimeout(
        function () {
            mkr = new google.maps.Marker(
                {
                    position: position,
                    map: map,
                    animation: google.maps.Animation.DROP
                }
            );
            mkr.addListener('click',(function(mkr,i) {
                return function(){
                    toggleBounce(mkr,i)
                }

            })(mkr,i)
            );
            mapMarkers.push(mkr);
        }, timeout
    )
}

function yelpSearch(location, term, map) {
    var searchUrl = "/yelpsearch?location=" + location + "&term=" + term;
    $.get(searchUrl, function(data){
        yelpList(JSON.parse(data), map);
    });
}
function yelpList(data, map){
    var businesses = data.businesses;
    var yelpList = $('#yelp_list');
    businesses.forEach(function(business,i){
        yelpList.append(listTemplate(business));
        pushBusinessMarker(business, map, i)

    })
}
function listTemplate(dataSet){
    var bImage = "<img src='"+ dataSet.image_url +"'>",
        bRating = "<img src='"+ dataSet.rating_img_url_small +"'>",
        lImage = "<li><div class='row'><div class='col-xs-3 img-container'>" + bImage +bRating+
            "</div>",
        lTitle = "<div class='col-xs-9'><h4>"+dataSet.name+"</h4>",
        lAddress = "<p>"+dataSet.location.display_address.join("</p><p>")+"</p></div></div></li>";
    return lImage+lTitle+lAddress
}
function pushBusinessMarker(dataSet, map, i){
    var blat = dataSet.location.coordinate.latitude,
        blng = dataSet.location.coordinate.longitude,
        bposition = new google.maps.LatLng(blat, blng);
    addMapMark(bposition,200, map, i)
}
function mouseOverMarkEvent(){

}
function toggleBounce(mkr,i){

    if (mkr.getAnimation()!== null){
        mkr.setAnimation(null);
        $('#mark_info').removeClass('show');
        $('#yelp_list').find('li').removeClass('active');
    }
    else{
        mapMarkers.forEach(function(marker,index){
            if (marker.getAnimation() !== null && index !== i){
                marker.setAnimation(null);
                $('#yelp_list').find('li').removeClass('active');
            }
            })
        }
        mkr.setAnimation(google.maps.Animation.BOUNCE);
        $('#yelp_list').find('li').eq(i).addClass('active');
        $('#mark_info').animate({
            scrollTop: 200 * i
        });
        $('#mark_info').addClass('show')
}

mapInit();
//yelpSearch('94087', 'Chinese Food', map);

