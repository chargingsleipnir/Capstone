function BuildScene2(scene) {

    scene.light.dir.bright = 0.75;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);

    function Start() {

    }

    function Update() {
    }

    function End() {

    }

    scene.SetCallbacks(Start, Update, End);
}