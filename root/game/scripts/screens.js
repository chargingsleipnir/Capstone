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
    skyBox.mdlHdlr.SetTexture(EM.assets.textures['starfield']);
    testCube.AddComponent(Components.modelHandler);
    testCube.mdlHdlr.SetTexture(EM.assets.textures['logo']);
    disc.AddComponent(Components.modelHandler);
    disc.mdlHdlr.SetTexture(GM.assets.textures['discSurface']);
    disc.AddComponent(Components.collisionBody);
    disc.collider.SetBoundingShape(BoundingShapes.aabb);
    cube.AddComponent(Components.modelHandler);
    cube.mdlHdlr.SetTexture(EM.assets.textures['questionBlock']);

    // Set starting transformations
    arrow.trfmLocal.SetPosAxes(-0.5, 1.0, -2.5);
    arrow.trfmLocal.SetScaleVec3(new Vector3(0.5, 2.0, 1.0));
    heart.trfmLocal.SetPosVec3(new Vector3(0.5, 0.5, -1.0));
    heart.trfmLocal.SetScaleAxes(3.0, 0.25, 1.0);
    arrow.trfmLocal.Rotate(new Vector3(1.0, 0.0, 0.0), 45.0);
    grid.trfmLocal.SetScaleAxes(10.0, 0.0, 10.0);
    skyBox.trfmLocal.SetScaleAxes(100.0, 100.0, 100.0);
    testCube.trfmLocal.SetPosVec3(new Vector3(1.5, 1.0, -1.0));
    disc.trfmLocal.SetPosAxes(0.0, 1.0, -5.0);
    cube.trfmLocal.SetPosVec3(new Vector3(-3.5, 0.0, -20.0));

    arrow.mdlHdlr.colourTint.SetValues(-0.2, 0.3, 0.5);
    heart.mdlHdlr.colourTint.SetValues(-0.2, 0.3, 0.5);
    cube.mdlHdlr.colourTint.SetValues(0.0, 0.5, 0.5);

    // Add to Capstone node
    GM.rootObj.AddChild(arrow);
    arrow.AddChild(heart);
    GM.rootObj.AddChild(zeroPointAxes);
    GM.rootObj.AddChild(grid);
    GM.rootObj.AddChild(skyBox);
    GM.rootObj.AddChild(testCube);
    GM.rootObj.AddChild(disc);
    GM.rootObj.AddChild(cube);

    // Other
    var arrowAxis = new Vector3(1.0, 0.0, 0.0);
    var heartAxis = new Vector3(0.0, 1.0, 0.0);
    var angle = 0.0;

    // Control camera
    var camRegName = "main camera";
    Input.RegisterObject(camRegName, true);
    camCtrl = new ControlScheme();
    camCtrl.moveLeft = Input.CreateInputController(camRegName, KeyMap.A);
    camCtrl.moveRight = Input.CreateInputController(camRegName, KeyMap.D);
    camCtrl.moveDown = Input.CreateInputController(camRegName, KeyMap.Q);
    camCtrl.moveUp = Input.CreateInputController(camRegName, KeyMap.E);
    camCtrl.moveBack = Input.CreateInputController(camRegName, KeyMap.S);
    camCtrl.moveForth = Input.CreateInputController(camRegName, KeyMap.W);
    camCtrl.yawLeft = Input.CreateInputController(camRegName, KeyMap.ArrowLeft);
    camCtrl.yawRight = Input.CreateInputController(camRegName, KeyMap.ArrowRight);
    camCtrl.pitchDown = Input.CreateInputController(camRegName, KeyMap.ArrowDown);
    camCtrl.pitchUp = Input.CreateInputController(camRegName, KeyMap.ArrowUp);


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
        balls[i].collider.SetBoundingShape(BoundingShapes.aabb);

        balls[i].AddComponent(Components.physicsBody);
        balls[i].rigidBody.mass = 0.5;
        balls[i].rigidBody.SetInertiaTensor(balls[i].collider.sphere.radius);
        GM.rootObj.AddChild(balls[i]);
    }
    var COEF_OF_REST = 1.0;
    var DRAG = 0.1;
    var WIND = new Vector3(0.25, 0.0, 0.0);
    var physicsTestName = "PhysicsTest";
    Input.RegisterObject(physicsTestName, true);
    var launch = Input.CreateInputController(physicsTestName, KeyMap.Z);

    this.Update = function() {

        if(launch.pressed){
            balls[0].rigidBody.velInitial.z = balls[0].rigidBody.velFinal.z = -7.5;
            launch.Release();
            //console.log(balls[0].rigidBody.velInitial);
        }
        //console.log(balls[0].trfmLocal.pos);

        // Physics updating, needs to be in physics class
        for(var i = 0; i < 4; i++) {
            balls[i].rigidBody.axisOfRotation = GBL_UP.GetCross(balls[i].rigidBody.velFinal);
            balls[i].rigidBody.axisOfRotation.SetNormalized();
            var mag = balls[i].rigidBody.velFinal.GetMag() / balls[i].collider.sphere.radius;
            balls[i].rigidBody.velAngular = balls[i].rigidBody.axisOfRotation.SetScaleByNum(mag);

            // Update rotation

            balls[i].rigidBody.acc.SetCopy(balls[i].rigidBody.velFinal.GetScaleByNum(-DRAG)).SetDivide(balls[i].rigidBody.mass);
            //balls[i].rigidBody.acc.SetAdd(WIND);
            balls[i].rigidBody.velFinal.SetCopy(balls[i].rigidBody.velInitial.GetAddScaled(balls[i].rigidBody.acc, Time.delta_Milli));
        }
        // Collision detection and response
        for(var i = 0; i < 4; i++) {
            for(var j = i+1; j < 4; j++) {
                var collisionDist = CollisionDetect.SphereVSphere(balls[i], balls[j]);
                if(collisionDist) {
                    var contactPt = balls[i].trfmGlobal.pos.GetAddScaled(collisionDist, 0.5);
                    balls[i].rigidBody.radiusToPt.SetCopy(contactPt.GetSubtract(balls[i].trfmGlobal.pos));
                    balls[j].rigidBody.radiusToPt.SetCopy(contactPt.GetSubtract(balls[j].trfmGlobal.pos));

                    collisionDist.SetNormalized();
                    var relative = collisionDist.GetDot(balls[i].rigidBody.velInitial.GetSubtract(balls[j].rigidBody.velInitial));
                    // Calculate impulse
                    var numerator = -relative * (COEF_OF_REST + 1.0);
                    var denomObj0 = collisionDist.GetDot((balls[i].rigidBody.inertiaTensorInv.MultiplyVec3(balls[i].rigidBody.radiusToPt.GetCross(collisionDist))).GetCross(balls[i].rigidBody.radiusToPt));
                    var denomObj1 = collisionDist.GetDot((balls[j].rigidBody.inertiaTensorInv.MultiplyVec3(balls[j].rigidBody.radiusToPt.GetCross(collisionDist))).GetCross(balls[j].rigidBody.radiusToPt));
                    var denominator = (1.0 / balls[i].rigidBody.mass) + (1.0 / balls[j].rigidBody.mass) + denomObj0 + denomObj1;
                    var impulse = numerator / denominator;
                    // Apply impulse as collision response
                    balls[i].rigidBody.velFinal.SetCopy(balls[i].rigidBody.velInitial.GetAdd(collisionDist.GetScaleByNum(impulse).SetDivide(balls[i].rigidBody.mass)));
                    balls[j].rigidBody.velFinal.SetCopy(balls[j].rigidBody.velInitial.GetAdd(collisionDist.GetScaleByNum(-impulse).SetDivide(balls[j].rigidBody.mass)));
                }
            }
            if(balls[i].rigidBody.velFinal.GetMagSqr() < INFINITESIMAL)
                balls[i].rigidBody.velFinal.SetZero();
        }


        angle += 0.005;

        skyBox.trfmLocal.Rotate(GBL_FWD, angle);

        if(camCtrl.moveLeft.pressed) {
            GM.activeCam.trfm.TranslateAxes(-GM.activeCam.moveSpeed, 0.0, 0.0);
        }
        else if(camCtrl.moveRight.pressed) {
            GM.activeCam.trfm.TranslateAxes(GM.activeCam.moveSpeed, 0.0, 0.0);
        }
        if(camCtrl.moveUp.pressed) {
            GM.activeCam.trfm.TranslateAxes(0.0, GM.activeCam.moveSpeed, 0.0);
        }
        else if(camCtrl.moveDown.pressed) {
            GM.activeCam.trfm.TranslateAxes(0.0, -GM.activeCam.moveSpeed, 0.0);
        }
        if(camCtrl.moveForth.pressed) {
            GM.activeCam.trfm.TranslateAxes(0.0, 0.0, -GM.activeCam.moveSpeed);
        }
        else if(camCtrl.moveBack.pressed) {
            GM.activeCam.trfm.TranslateAxes(0.0, 0.0, GM.activeCam.moveSpeed);
        }
        if(camCtrl.yawLeft.pressed) {
            GM.activeCam.trfm.RotateView(GM.activeCam.turnSpeed, GM.activeCam.trfm.dirUp);
        }
        else if(camCtrl.yawRight.pressed) {
            GM.activeCam.trfm.RotateView(-GM.activeCam.turnSpeed, GM.activeCam.trfm.dirUp);
        }

        // if button pressed
        // var nextScreen = new Screen_InGame();
        // GM.SetLoopCallback(nextScreen.Update);
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