var Screens = { test: 0, title: 1, inGame: 2, gameOver: 3 };

function Screen_Test(ScreenChangeCallback)
{
    // Might not be necessary?
    CollisionMap.CreateMap(Vector3.CreateManual(200, 200, 200), 3);

    var camera_Main = new Camera('Main', ProjectionType.PERSPECTIVE, game)

    // OBJECTS TO HELP BUILD GAME ---------------------------------------------------------------------------------
    var zeroPointAxes = new GameObject('zeroPointAxes', Labels.productionEnvironment);
    var grid = new GameObject('grid', Labels.productionEnvironment);
    //var axesGrid = new GameObject('axesGrid', Labels.productionEnvironment);
    grid.transform.scale = [10.0, 10.0, 10.0];
    //axesGrid.transform.SetScale([10.0, 10.0, 10.0]);
    zeroPointAxes.AddComponent(new MeshRenderer(game.gl, Primitives.axesZeroPoints, null));
    grid.AddComponent(new MeshRenderer(game.gl, Primitives.grid, null));
    //axesGrid.AddComponent(new MeshRenderer(game.gl, Primitives.axesGrid, null));
    grid.transform.Update();
    //axesGrid.transform.Update();
    camera_Main.Shoot(zeroPointAxes);
    camera_Main.Shoot(grid);
    //camera_Main.Shoot(axesGrid);

    // GAME WORLD ---------------------------------------------------------------------------------
    var skyBox = new GameObject('night sky', Labels.testObject);
    skyBox.AddComponent(new MeshRenderer(game.gl, new Primitives.IcoSphere(2), [Assets.textureImages['starfield']]));
    skyBox.AddComponent(new Behaviour_SkyBox(skyBox));
    camera_Main.Shoot(skyBox);

    Light_Ambient.intensity = 0.3;
    Light_Directional.direction = [-1.5, 1.0, 1.0];
    Light_Directional.intensity = 0.3;
    Light_Point.position = [0.0, 0.0, 0.0];
    Light_Point.intensity = 0.8;

    // PARENT-CHILD and MOTION TESTING ---------------------------------------------------------------------------------
    var centreBox = new GameObject('centre box', Labels.testObject);
    centreBox.AddComponent(new MeshRenderer(game.gl, Assets.modelData.dimensionBox, [Assets.textureImages['logo']]));
    centreBox.AddComponent(new Behaviour_CentreBox(centreBox));
    camera_Main.Shoot(centreBox);
    var orbit1Box1 = new GameObject('orbit 1 box 1', Labels.testObject);
    orbit1Box1.AddComponent(new MeshRenderer(game.gl, Assets.modelData.dimensionBox, [Assets.textureImages['logo']]));
    orbit1Box1.AddComponent(new Behaviour_Orbit1Box1(orbit1Box1));
    camera_Main.Shoot(orbit1Box1);
    centreBox.AddChild(orbit1Box1);
    var orbit1Box2 = new GameObject('orbit 1 box 2', Labels.testObject);
    orbit1Box2.AddComponent(new MeshRenderer(game.gl, Assets.modelData.dimensionBox, [Assets.textureImages['logo']]));
    orbit1Box2.AddComponent(new Behaviour_Orbit1Box2(orbit1Box2));
    camera_Main.Shoot(orbit1Box2);
    centreBox.AddChild(orbit1Box2);
    var orbit2Box1 = new GameObject('orbit 2 box 1', Labels.testObject);
    orbit2Box1.AddComponent(new MeshRenderer(game.gl, Assets.modelData.dimensionBox, [Assets.textureImages['logo']]));
    orbit2Box1.AddComponent(new Behaviour_Orbit2Box1(orbit2Box1));
    camera_Main.Shoot(orbit2Box1);
    orbit1Box1.AddChild(orbit2Box1);
    var orbit2Box2 = new GameObject('orbit 2 box 2', Labels.testObject);
    orbit2Box2.AddComponent(new MeshRenderer(game.gl, Assets.modelData.dimensionBox, [Assets.textureImages['logo']]));
    orbit2Box2.AddComponent(new Behaviour_Orbit2Box2(orbit2Box2));
    camera_Main.Shoot(orbit2Box2);
    orbit1Box1.AddChild(orbit2Box2);
    var orbit2Box3 = new GameObject('orbit 2 box 3', Labels.testObject);
    orbit2Box3.AddComponent(new MeshRenderer(game.gl, Assets.modelData.dimensionBox, [Assets.textureImages['logo']]));
    orbit2Box3.AddComponent(new Behaviour_Orbit2Box3(orbit2Box3));
    camera_Main.Shoot(orbit2Box3);
    orbit1Box2.AddChild(orbit2Box3);
    var orbit2Box4 = new GameObject('orbit 2 box 4', Labels.testObject);
    orbit2Box4.AddComponent(new MeshRenderer(game.gl, Assets.modelData.dimensionBox, [Assets.textureImages['logo']]));
    orbit2Box4.AddComponent(new Behaviour_Orbit2Box4(orbit2Box4));
    camera_Main.Shoot(orbit2Box4);
    orbit1Box2.AddChild(orbit2Box4);

    // PHYSICS TESTING ---------------------------------------------------------------------------------
    var bullet = new GameObject('bullet', Labels.testObject);
    var anchor = new GameObject('anchor', Labels.testObject);
    anchor.transform.position = [5.0, 7.0, -10.0];
    var springLoad = new GameObject('springLoad', Labels.testObject);
    var springLoadPush = new GameObject('springLoad_PushUp_GravityDown', Labels.testObject);
    var springLoadPull = new GameObject('springLoad_PullToPushedObject', Labels.testObject);
    bullet.AddComponent(new MeshRenderer(game.gl, Assets.modelData.marble, null));
    anchor.AddComponent(new MeshRenderer(game.gl, Primitives.arrow, null));
    springLoad.AddComponent(new MeshRenderer(game.gl, Assets.modelData.marble, null));
    springLoadPush.AddComponent(new MeshRenderer(game.gl, Assets.modelData.marble, null));
    springLoadPull.AddComponent(new MeshRenderer(game.gl, Assets.modelData.marble, null));
    bullet.AddComponent(new ParticlePhysics(bullet));
    springLoad.AddComponent(new ParticlePhysics(springLoad));
    springLoadPush.AddComponent(new ParticlePhysics(springLoadPush));
    springLoadPull.AddComponent(new ParticlePhysics(springLoadPull));
    bullet.AddComponent(new Behaviour_Bullet(bullet));
    springLoad.AddComponent(new Behaviour_SpringLoad(springLoad, anchor));
    springLoadPush.AddComponent(new Behaviour_SpringLoadPush(springLoadPush, anchor));
    springLoadPull.AddComponent(new Behaviour_SpringLoadPull(springLoadPull, springLoadPush));
    camera_Main.Shoot(bullet);
    camera_Main.Shoot(anchor);
    camera_Main.Shoot(springLoad);
    camera_Main.Shoot(springLoadPush);
    camera_Main.Shoot(springLoadPull);

    // COLLISION TESTING ---------------------------------------------------------------------------------
    var collisionBounds = new GameObject('collisionBounds', Labels.testObject);
    collisionBounds.AddComponent(new MeshRenderer(game.gl, Primitives.cube, [Assets.textureImages['questionBlock']]));
    collisionBounds.transform.position = [-50.0, 50.1, -50.0];
    collisionBounds.transform.scale = [50.0, 50.0, 50.0];
    //camera_Main.Shoot(collisionBounds);

    var donut = new GameObject('donut', Labels.testObject);
    donut.AddComponent(new MeshRenderer(game.gl, Assets.modelData.donut, null));
    donut.AddComponent(new CollisionBody(donut, CollisionBodies.mesh));
    donut.components[Components.collisionBody].CreateWireFrame(game.gl);
    donut.AddComponent(new Behaviour_Donut(donut));
    camera_Main.Shoot(donut);
    camera_Main.Shoot(donut.components[Components.collisionBody].wireFrame);
    
    var collisionBallsBoxed = [];
    for (var i = 0; i < 10; i++) {
        collisionBallsBoxed[i] = new GameObject('collisionBallBoxed ' + i, Labels.testObject);
        collisionBallsBoxed[i].AddComponent(new MeshRenderer(game.gl, new Primitives.IcoSphere(2), [Assets.textureImages['lava']]));
        collisionBallsBoxed[i].AddComponent(new ParticlePhysics(collisionBallsBoxed[i]));
        collisionBallsBoxed[i].AddComponent(new CollisionBody(collisionBallsBoxed[i], CollisionBodies.aabb));
        collisionBallsBoxed[i].components[Components.collisionBody].CreateWireFrame(game.gl);
        collisionBallsBoxed[i].AddComponent(new Behaviour_CollisionBallsBoxed(collisionBallsBoxed[i]));
        camera_Main.Shoot(collisionBallsBoxed[i]);
        camera_Main.Shoot(collisionBallsBoxed[i].components[Components.collisionBody].wireFrame);
    }
    
    collisionBallsBoxed[0].transform.position = [-25, 25, -25];
    collisionBallsBoxed[0].components[Components.particlePhysics].velocity = [0.0, 0.0, 0.0];
    collisionBallsBoxed[1].transform.position = [-20, 25, -25];
    collisionBallsBoxed[1].components[Components.particlePhysics].velocity = [0.0, 20.0, 0.0];
    collisionBallsBoxed[2].transform.position = [-12.5, 75, -25];
    collisionBallsBoxed[2].components[Components.particlePhysics].velocity = [0.0, 0.0, 0.0];
    collisionBallsBoxed[3].transform.position = [-65.0, 30.0, -20.0];
    collisionBallsBoxed[3].components[Components.particlePhysics].velocity = [0.0, 30.0, 0.0];
    var collisionSpike = new GameObject('collisionSpike', Labels.testObject);
    collisionSpike.AddComponent(new MeshRenderer(game.gl, Assets.modelData.spike, null));
    collisionSpike.AddComponent(new ParticlePhysics(collisionSpike));
    collisionSpike.AddComponent(new CollisionBody(collisionSpike, CollisionBodies.aabb));
    collisionSpike.components[Components.collisionBody].CreateWireFrame(game.gl);
    collisionSpike.AddComponent(new Behaviour_Spike(collisionSpike));
    camera_Main.Shoot(collisionSpike);
    camera_Main.Shoot(collisionSpike.components[Components.collisionBody].wireFrame);

    var collisionBallsSphered = [];
    for (var i = 0; i < 10; i++) {
        collisionBallsSphered[i] = new GameObject('collisionBallSphered ' + i, Labels.testObject);
        collisionBallsSphered[i].AddComponent(new MeshRenderer(game.gl, new Primitives.IcoSphere(2), [Assets.textureImages['ice']]));
        collisionBallsSphered[i].AddComponent(new ParticlePhysics(collisionBallsSphered[i]));
        collisionBallsSphered[i].AddComponent(new CollisionBody(collisionBallsSphered[i], CollisionBodies.sphere));
        collisionBallsSphered[i].components[Components.collisionBody].CreateWireFrame(game.gl);
        collisionBallsSphered[i].AddComponent(new Behaviour_CollisionBallsSphered(collisionBallsSphered[i]));
        camera_Main.Shoot(collisionBallsSphered[i]);
        camera_Main.Shoot(collisionBallsSphered[i].components[Components.collisionBody].wireFrame);
    }
    collisionBallsSphered[0].transform.position = [-25, 25, 25];
    collisionBallsSphered[0].components[Components.particlePhysics].velocity = [0.0, 0.0, 0.0];
    
    this.Update = function()
    {
        skyBox.Update();

        centreBox.Update();

        bullet.Update();
        anchor.Update();
        springLoad.Update();
        springLoadPush.Update();
        springLoadPull.Update();

        donut.Update();

        for (var i = 0; i < collisionBallsBoxed.length; i++)
            collisionBallsBoxed[i].Update();
        collisionSpike.Update();

        for (var i = 0; i < collisionBallsSphered.length; i++)
            collisionBallsSphered[i].Update();

        CollisionChecker.Update();
        CollisionMap.Update();
        ParticleForceRegistry.Update();

        camera_Main.Update();
    }
}

function Screen_Title(ScreenChangeCallback) {

    var arrow = new GameObject('arrow', Labels.testObject);
    var heart = new GameObject('heart', Labels.testObject);
    var zeroPointAxes = new GameObject('zeroPointAxes', Labels.productionEnvironment);
    var grid = new GameObject('grid', Labels.productionEnvironment);
    var skyBox = new GameObject('skybox', Labels.testObject);
    var testCube = new GameObject('test cube', Labels.testObject);
    var disc = new GameObject('disc', Labels.none);
    var cube = new GameObject('primitive cube', Labels.testObject);

    // Assign models
    // Possibly with the texture addition in AddModel?
    arrow.SetModel(Primitives.arrow);
    heart.SetModel(Primitives.heart);
    zeroPointAxes.SetModel(Primitives.axesZeroPoints);
    grid.SetModel(Primitives.grid);
    skyBox.SetModel(new Primitives.IcoSphere(2, 1));
    testCube.SetModel(EM.assets.models['dimensionBox']);
    disc.SetModel(GM.assets.models['disc']);
    cube.SetModel(new Primitives.Cube(new Vector3(1.5, 3.0, 4.5), true));

    // Add rendering components
    arrow.AddComponent(Components.modelHandler);
    heart.AddComponent(Components.modelHandler);
    zeroPointAxes.AddComponent(Components.modelHandler);
    grid.AddComponent(Components.modelHandler);
    skyBox.AddComponent(Components.modelHandler);
    skyBox.mdlHdlr.SetTexture(EM.assets.textures['starfield'], TextureFilters.nearest);
    testCube.AddComponent(Components.modelHandler);
    testCube.mdlHdlr.SetTexture(EM.assets.textures['logo'], TextureFilters.linear);
    disc.AddComponent(Components.modelHandler);
    disc.mdlHdlr.SetTexture(GM.assets.textures['discSurface'], TextureFilters.linear);
    disc.AddComponent(Components.collisionBody);
    //disc.collider.SetBoundingShape(BoundingShapes.aabb);
    cube.AddComponent(Components.modelHandler);
    cube.mdlHdlr.SetTexture(EM.assets.textures['questionBlock'], TextureFilters.linear);

    // Set starting transformations
    arrow.trfmLocal.SetPosAxes(-0.5, 1.0, -2.5);
    heart.trfmLocal.SetPosVec3(new Vector3(3.5, 0.5, -1.0));
    grid.trfmLocal.SetScaleAxes(10.0, 0.0, 10.0);
    skyBox.trfmLocal.SetScaleAxes(100.0, 100.0, 100.0);
    testCube.trfmLocal.SetPosVec3(new Vector3(1.5, 1.5, -1.5));
    disc.trfmLocal.SetPosAxes(0.0, 1.0, -5.0);
    cube.trfmLocal.SetPosVec3(new Vector3(-3.5, 0.0, -20.0));

    arrow.mdlHdlr.colourTint.SetValues(-0.2, 0.3, 0.5);
    heart.mdlHdlr.colourTint.SetValues(-0.2, 0.3, 0.5);
    cube.mdlHdlr.colourTint.SetValues(0.0, 0.5, 0.5);

    testCube.AddComponent(Components.collisionBody);
    arrow.AddComponent(Components.collisionBody);
    heart.AddComponent(Components.collisionBody);

    // Add to Capstone node
    GM.rootObj.AddChild(skyBox);
    GM.rootObj.AddChild(disc);
    disc.AddChild(arrow);
    disc.AddChild(heart);
    GM.rootObj.AddChild(zeroPointAxes);
    GM.rootObj.AddChild(grid);
    GM.rootObj.AddChild(testCube);

    GM.rootObj.AddChild(cube);

    /******************************** GOOD TIME TO MAKE A HUD *************************************************/

    var hud = new GUISystem(new WndRect(20, 20, GM.wndWidth - 40, GM.wndHeight - 40), "in-game HUD");

    var style = new MsgBoxStyle();
    style.fontSize = 20;
    style.fontColour = new Vector3(0.7, 0.0, 0.0);
    style.textMaxWidth = 60;
    style.textAlignWidth = Alignment.right;
    style.textAlignHeight = Alignment.bottom;
    style.bgTexture = null;
    style.bgColour = new Vector3(0.0, 0.6, 0.0);
    style.textLineSpacing = 15.0;
    style.margin = 5.0;
    var firstMsg = new GUIObject(new WndRect(0, 0, 300, 300), "Looky at me. I made my own font.", style);

    style.bgColour = new Vector3(0.0, 0.0, 1.0);
    style.fontSize = 15;
    style.textAlignWidth = Alignment.left;
    style.textAlignHeight = Alignment.top;
    style.textLineSpacing = 10.0;
    var firstMsgCh1 = new GUIObject(new WndRect(20, 50, 200, 200), "Child 1 of first message.", style);

    style.bgColour = new Vector3(1.0, 0.0, 0.0);
    style.fontSize = 10;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.textLineSpacing = 5.0;
    var firstMsgCh2 = new GUIObject(new WndRect(30, 30, 100, 100), "Child 2 of first message.", style);

    style.bgColour = new Vector3(0.0, 1.0, 1.0);
    style.fontSize = 12;
    style.textLineSpacing = 0.0;
    var secondMsg = new GUIObject(new WndRect(99999, 999999, 100, 100), "Second message", style);

    firstMsg.AddChild(firstMsgCh1);
    firstMsgCh1.AddChild(firstMsgCh2);
    hud.AddGUIObject(firstMsg);
    hud.AddGUIObject(secondMsg);

    GUINetwork.AddSystem(hud, false);
    GUINetwork.SetActive(hud.name, true);

    /******************************** PHYSICS IMPLEMENTATION *************************************************/
    var balls = [];
    var startPositions = [
        new Vector3(-5.0, 1.0, -4.0),
        new Vector3(-5.75, 1.0, -12.0),
        new Vector3(1.5, 1.0, -14.0),
        new Vector3(-11.0, 1.0, -19.0)
    ];

    for(var i = 0; i < 4; i++) {
        balls[i] = new GameObject('physics test ball', Labels.testObject);
        balls[i].SetModel(new Primitives.IcoSphere(2, 1));
        balls[i].AddComponent(Components.modelHandler);
        balls[i].mdlHdlr.MakeWireFrame();
        balls[i].mdlHdlr.colourTint.SetValues(Math.sin(i), Math.cos(i), Math.tan(i));
        balls[i].trfmLocal.SetPosVec3(startPositions[i]);

        balls[i].AddComponent(Components.collisionBody);
        //balls[i].collider.SetBoundingShape(BoundingShapes.aabb);

        balls[i].AddComponent(Components.rigidBody);
        balls[i].AddScript(new ImpulseBalls());

        GM.rootObj.AddChild(balls[i]);
    }

    balls[0].AddComponent(Components.camera);
    balls[0].camera.SetControlsActive(true);

    var physicsTestName = "PhysicsTest";
    Input.RegisterObject(physicsTestName, true);
    var launch = Input.CreateInputController(physicsTestName, KeyMap.Z);
    var launchForce = new Vector3(0.0, 0.0, -250.0);

    var angle = 0.01;
    var waveringValue = 0.0;
    this.Update = function() {

        if(launch.pressed){
            balls[0].rigidBody.AddForce(launchForce);
            DM.ToDisplay(false, false, false, true, true);
            launch.Release();
        }

        waveringValue += angle;
        //waveringValue = Math.sin(waveringValue);

        skyBox.trfmLocal.Rotate(VEC3_FWD, angle);
        disc.trfmLocal.Rotate(VEC3_RIGHT, angle * 20.0);
        disc.trfmLocal.ScaleAxes(Math.sin(waveringValue)  / 100, Math.sin(waveringValue) / 100, 0.0);

        // if button pressed
        //var nextScreen = new Screen_InGame();
        //GM.SetLoopCallback(nextScreen.Update);
    }
}

function Screen_InGame(ScreenChangeCallback) {

    this.Update = function() {

        // if loseCondition:
        //ScreenChangeCallback(new Screen_GameOver(ScreenChangeCallback));
    }
}

function Screen_GameOver(ScreenChangeCallback) {



    this.Update = function() {
        // if button pressed
        //ScreenChangeCallback(new Screen_Title(ScreenChangeCallback));
    }
}