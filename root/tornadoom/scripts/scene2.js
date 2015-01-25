function BuildScene2(scene) {

    scene.light.amb.bright = 0.5;
    scene.light.dir.bright = 0.75;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);

    var cows = [];
    var MAX_COWS = 10;

    for(var i = 0; i < MAX_COWS; i++ ) {
        cows[i] = new GameObject('cow' + i, Labels.movable);
        cows[i].SetModel(GameMngr.assets.models['cow']);
        cows[i].mdlHdlr.SetTexture(GameMngr.assets.textures['cowTex'], TextureFilters.linear);
        cows[i].trfmLocal.SetScaleAxes(0.25, 0.25, 0.25);
        cows[i].trfmLocal.SetPosAxes(3.0, 0.0, -i * 3);
    }

    function Start() {

    }

    function Update() {
    }

    function End() {

    }

    for(var i = 0; i < MAX_COWS; i++ )
        scene.Add(cows[i]);

    scene.SetCallbacks(Start, Update, End);
}