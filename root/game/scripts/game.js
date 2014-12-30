/**
 * Created by Devin on 2014-12-29.
 */

function BuildGame() {

    /********************************** GLOBAL GAME VARIABLES **********************************/
    var player = new GameObject('disc', Labels.none);
    player.SetModel(GameMngr.assets.models['disc']);
    player.AddComponent(Components.modelHandler);
    player.mdlHdlr.SetTexture(GameMngr.assets.textures['discSurface'], TextureFilters.linear);
    player.AddComponent(Components.collisionBody);
    player.trfmLocal.SetPosAxes(10.0, 5.0, -5.0);

    var skyBox = new GameObject('skybox', Labels.testObject);
    skyBox.SetModel(new Primitives.IcoSphere(2, 1));
    skyBox.AddComponent(Components.modelHandler);
    skyBox.mdlHdlr.SetTexture(EL.assets.textures['starfield'], TextureFilters.nearest);
    skyBox.trfmLocal.SetScaleAxes(100.0, 100.0, 100.0);


    // Title screen just has gui elements
    var title = new Scene("Title Screen");
    BuildScene1(title);
    SceneMngr.AddScene(title, true);


    // Level 1 with player and internal objects
    var level1 = new Scene("Basic Testbed");
    level1.Add(player);
    level1.Add(skyBox);
    BuildScene2(level1, player, skyBox);
    SceneMngr.AddScene(level1, false);


    // Level 2 with player and internal objects
    var level2 = new Scene("Physics Testbed");
    level2.Add(skyBox);
    BuildScene3(level2, skyBox);
    SceneMngr.AddScene(level2, false);


    GameMngr.BeginLoop();
}