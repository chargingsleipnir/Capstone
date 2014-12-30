
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