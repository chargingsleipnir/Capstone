function BuildScene2(scene) {

    scene.light.amb.bright = 0.5;
    scene.light.dir.bright = 0.25;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);
    scene.light.pnt.bright = 0.0;
    scene.light.pnt.pos.SetValues(0.0, 0.0, 0.0);

    function RaiseToGruond(obj) {
        var halfHeight = obj.shapeData.radii.y * obj.trfmBase.scale.y;
        obj.trfmBase.SetPosByAxes(0.0, halfHeight, 0.0);
    }

    var ground = new GameObject('ground', Labels.none);
    ground.SetModel(GameMngr.assets.models['ground']);
    ground.mdlHdlr.SetTexture(GameMngr.assets.textures['groundTex'], TextureFilters.mipmap);

    var fence = new GameObject('fence', Labels.none);
    fence.SetModel(GameMngr.assets.models['fence']);
    fence.mdlHdlr.SetTexture(GameMngr.assets.textures['fenceTex'], TextureFilters.mipmap);
    RaiseToGruond(fence);
    fence.trfmBase.TranslateByAxes(0.0, 0.0, 0.6);

    var barn = new GameObject('barn', Labels.none);
    barn.SetModel(GameMngr.assets.models['barn']);
    barn.mdlHdlr.SetTexture(GameMngr.assets.textures['barnTex'], TextureFilters.linear);
    RaiseToGruond(barn);
    barn.trfmBase.TranslateByAxes(1.7, 0.0, -8.0);

    var wagon = new GameObject('wagon', Labels.none);
    wagon.SetModel(GameMngr.assets.models['wagon']);
    wagon.mdlHdlr.SetTexture(GameMngr.assets.textures['wagonTex'], TextureFilters.linear);
    RaiseToGruond(wagon);
    wagon.trfmBase.TranslateByAxes(-1.5, 0.0, -8.0);

    var cows = [];
    var MAX_COWS = 10;
    var bales = [];
    var MAX_BALES = 10;

    for(var i = 0; i < MAX_COWS; i++ ) {
        cows[i] = new Cow();
        if(i < 5) cows[i].obj.trfmBase.TranslateByAxes(3.0, 0.0, -i * 6);
        else cows[i].obj.trfmBase.TranslateByAxes(-3.0, 0.0, ((-i + (MAX_COWS / 2)) * 6));

        bales[i] = new HayBale();
        if(i < 5) bales[i].obj.trfmBase.TranslateByAxes(6.0, 0.0, -i * 6);
        else bales[i].obj.trfmBase.TranslateByAxes(-6.0, 0.0, ((-i + (MAX_BALES / 2)) * 6));
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

    scene.Add(ground);
    scene.Add(fence);
    scene.Add(barn);
    scene.Add(wagon);
    for(var i = 0; i < MAX_COWS; i++ ) {
        scene.Add(cows[i].obj);
        scene.Add(bales[i].obj);
    }

    scene.SetCallbacks(Start, Update, End);
}