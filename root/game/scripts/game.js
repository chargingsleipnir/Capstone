/**
 * Created by Devin on 2014-12-29.
 */

function BuildGame() {

    /********************************** GLOBAL GAME VARIABLES **********************************/
    var player = new GameObject('disc', Labels.none);
    player.SetModel(GameMngr.assets.models['disc']);
    player.mdlHdlr.SetTexture(GameMngr.assets.textures['discSurface'], TextureFilters.linear);
    player.AddComponent(Components.collisionBody);
    player.trfmLocal.SetPosAxes(10.0, 5.0, -5.0);

    var skyBox = new GameObject('skybox', Labels.testObject);
    skyBox.SetModel(new Primitives.IcoSphere(2, 1));
    skyBox.mdlHdlr.SetTexture(EL.assets.textures['starfield'], TextureFilters.nearest);
    skyBox.trfmLocal.SetScaleAxes(100.0, 100.0, 100.0);


    // Title screen just has gui elements
    var title = new Scene("Title Screen");
    BuildScene1(title);
    SceneMngr.AddScene(title, true);


    // Player, internal objects, and several different giu elements
    var guiTest = new Scene("Basic Testbed with HUD");
    guiTest.Add(player);
    guiTest.Add(skyBox);
    BuildScene2(guiTest, player);
    SceneMngr.AddScene(guiTest, false);


    // Physics testing
    var physicsTest = new Scene("Physics Testbed");
    physicsTest.Add(skyBox);
    BuildScene3(physicsTest);
    SceneMngr.AddScene(physicsTest, false);


    // Various lighting samples and materials being used.
    var lightTest = new Scene("Light and blend testing");
    lightTest.Add(skyBox);
    BuildScene4(lightTest);
    SceneMngr.AddScene(lightTest, false);


    // Various particle systems being used.
    var particleTest = new Scene("Particle system testing");
    particleTest.Add(skyBox);
    BuildScene5(particleTest);
    SceneMngr.AddScene(particleTest, false);


    var angle = 0.01;
    function GameUpdate() {
        skyBox.trfmLocal.Rotate(VEC3_FWD, angle);
    }

    GameMngr.UserUpdate = GameUpdate;
    GameMngr.BeginLoop();
}