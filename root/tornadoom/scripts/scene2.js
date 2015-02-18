function BuildScene2(scene) {

    scene.light.amb.bright = 0.5;
    scene.light.dir.bright = 0.25;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);
    scene.light.pnt.bright = 0.0;
    scene.light.pnt.pos.SetValues(0.0, 0.0, 0.0);

    var cows = [];
    var MAX_COWS = 20;
    var bales = [];
    var MAX_BALES = 20;

    for(var i = 0; i < MAX_COWS; i++ ) {
        cows[i] = new Cow();
        if(i < 10) cows[i].obj.trfmLocal.TranslateBaseByAxes(3.0, 0.0, -i * 6);
        else cows[i].obj.trfmLocal.TranslateBaseByAxes(-3.0, 0.0, ((-i + (MAX_COWS / 2)) * 6));

        bales[i] = new HayBale();
        if(i < 10) bales[i].obj.trfmLocal.TranslateBaseByAxes(6.0, 0.0, -i * 6);
        else bales[i].obj.trfmLocal.TranslateBaseByAxes(-6.0, 0.0, ((-i + (MAX_BALES / 2)) * 6));
    }

    function Start() {
        for(var i = 0; i < MAX_COWS; i++ ) {

        }
    }

    function Update() {
        for(var i = 0; i < MAX_COWS; i++ ) {
            cows[i].Update();
            bales[i].Update();
        }
    }

    function End() {

    }

    for(var i = 0; i < MAX_COWS; i++ ) {
        scene.Add(cows[i].obj);
        scene.Add(bales[i].obj);
    }

    scene.SetCallbacks(Start, Update, End);
}