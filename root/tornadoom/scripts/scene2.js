function BuildScene2(scene) {

    scene.light.amb.bright = 0.5;
    scene.light.dir.bright = 0.75;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);

    var cows = [];
    var MAX_COWS = 20;

    for(var i = 0; i < MAX_COWS; i++ ) {
        cows[i] = new Cow();

        if(i < 10)
            cows[i].obj.trfmLocal.TranslateAxes(3.0, 0.0, -i * 6);
        else
            cows[i].obj.trfmLocal.TranslateAxes(-3.0, 0.0, ((-i + (MAX_COWS / 2)) * 6));
    }

    function Start() {
        for(var i = 0; i < MAX_COWS; i++ ) {
            //cows[i].obj.trfmLocal.SetScaleAxes(3.0, 3.0, 3.0);
        }
    }

    function Update() {

    }

    function End() {

    }

    for(var i = 0; i < MAX_COWS; i++ )
        scene.Add(cows[i].obj);

    scene.SetCallbacks(Start, Update, End);
}