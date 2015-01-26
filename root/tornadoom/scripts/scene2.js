function BuildScene2(scene) {

    scene.light.amb.bright = 0.5;
    scene.light.dir.bright = 0.75;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);

    var cows = [];
    var MAX_COWS = 10;

    for(var i = 0; i < MAX_COWS; i++ ) {
        cows[i] = new Cow();
        cows[i].obj.trfmLocal.TranslateAxes(3.0, 0.0, -i * 3);
    }

    function Start() {

    }

    function Update() {
    }

    function End() {

    }

    for(var i = 0; i < MAX_COWS; i++ )
        scene.Add(cows[i].obj);

    scene.SetCallbacks(Start, Update, End);
}