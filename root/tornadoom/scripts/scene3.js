/**
 * Created by Devin on 2014-12-29.
 */

function BuildScene3(scene) {

    // Test capsule and radial capsule collisions

    var sphere1 = new Sphere(new Vector3(6.0, 4.5, 0.0), 2.0);
    //var sphere2 = new Sphere(new Vector3(1.01, 0.0, 0.0), 1.0);

    var pos = new Vector3(1.5, 0.0, 0.0),
        radius = 1.0,
        axis = new Vector3(0.0, 0.0, -1.0),
        halfLen = 2.0,
        rot = new Quaternion();
    rot.SetFromAxisAngle(VEC3_UP, -60.0);
    var capsule1 = new Capsule(pos, radius, axis, halfLen, rot);

    /*
    pos = new Vector3(-1.5, 0.0, 0.0);
    radius = 1.0;
    axis = new Vector3(0.0, 0.0, -1.0);
    halfLen = 2.0;
    rot = new Quaternion();
    rot.SetFromAxisAngle(VEC3_UP, 60.0);
    var capsule2 = new Capsule(pos, radius, axis, halfLen, rot);
    */

    pos = new Vector3(3.0, 3.0, 0.0);
    radius = 1.0;
    var planeNorm = new Vector3(1.0, 1.0, 1.0);
    planeNorm.SetNormalized();
    var planarRadius = 3.0;
    rot = new Quaternion();
    var donut1 = new Donut(pos, radius, planeNorm, planarRadius, rot);

    //var collisionCheck = donut1.IntersectsCapsule(sphere1);
    //console.log(collisionCheck);
    console.log(donut1.IntersectsSphere(sphere1));

    function Start() {

    }

    function Update() {

    }

    function End() {

    }

    scene.SetCallbacks(Start, Update, End);
}