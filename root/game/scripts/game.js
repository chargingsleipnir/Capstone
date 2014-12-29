/**
 * Created by Devin on 2014-12-29.
 */

function BuildGame() {

    /********************************** GLOBAL GAME VARIABLES **********************************/
    var player = new GameObject('disc', Labels.none);
    player.SetModel(GM.assets.models['disc']);
    player.AddComponent(Components.modelHandler);
    player.mdlHdlr.SetTexture(GM.assets.textures['discSurface'], TextureFilters.linear);
    player.AddComponent(Components.collisionBody);
    player.trfmLocal.SetPosAxes(0.0, 1.0, -5.0);

    var skyBox = new GameObject('skybox', Labels.testObject);
    skyBox.SetModel(new Primitives.IcoSphere(2, 1));
    skyBox.AddComponent(Components.modelHandler);
    skyBox.mdlHdlr.SetTexture(EL.assets.textures['starfield'], TextureFilters.nearest);
    skyBox.trfmLocal.SetScaleAxes(100.0, 100.0, 100.0);


    // Title screen just has gui elements
    var title = new Scene("Title Screen");
    BuildScene1(title);
    SceneNetwork.AddScene(title, true);


    // Level 1 with player and internal objects
    var level1 = new Scene("Level 1");
    level1.Add(player);
    level1.Add(skyBox);
    BuildScene2(level1, player, skyBox);
    SceneNetwork.AddScene(level1, false);


    /*
    // Level 2 with player and internal objects
    var level2 = new Scene("Level 2");
    level2.Render(player);
    BuildScene3(level2, player);
    SceneNetwork.AddScene(level2, false);


    // Game Over screen just has gui elements
    var gameOver = new Scene("Game Over Screen");
    BuildScene4(gameOver);
    SceneNetwork.AddScene(gameOver, false);
    */


    SceneNetwork.BeginLoop();
}