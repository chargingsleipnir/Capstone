
function CollisionBody(shapeData, trfm) {
    /// <signature>
    ///  <summary>Add collision body to gameobject</summary>
    ///  <param name="shapeData" type="object">Data container describing the object's relative shape</param>
    ///  <param name="trfm" type="Transform">Transform of GameObject</param>
    ///  <returns type="CollisionBody" />
    /// </signature>

    this.trfm = trfm;
    this.shapeData = shapeData;

    this.sphere = new Sphere(this.trfm.pos, shapeData.radius);
    this.aabb = new AABB(this.trfm.pos, shapeData.radii);

    // Sphere set as standard
    //this.activeShape = this.sphere;

    if(DM.GetActive()) {
        var shell = new ModelHandler(new Primitives.IcoSphere(1, this.sphere.radius), this.shapeData);
        //var shell = new ModelHandler(new Primitives.Cube(this.aabb.radii, false), this.shapeData);
        shell.MakeWireFrame();
        shell.colourTint.SetValues(1.0, 1.0, 0.0);

        var debugTrfm = new Transform(Space.local);
        debugTrfm.pos = this.trfm.pos;

        DM.AddBoundingShell(shell, debugTrfm);
    }
    // Intentionally left this blank to bypass condition checks
    //this.SetBoundingShape();

    this.active = true;
    this.detectOnly = true;
    // These all hold generic bs so I don't have to check if it exists every frame;
    this.DetectionCallback = function(collider){};
    this.ResponseCallback = function(collider){};
    this.rigidBody = new RigidBody(new Transform(), 1.0);

    CollisionNetwork.AddBody(this);  // ?? Not sure how this will work just yet
}
CollisionBody.prototype = {
    SetRigidBody: function(rigidBody) {
        /// <signature>
        ///  <summary>Adding rigidbody will automatically switch detectOnly off and use collision response as well as detection</summary>
        ///  <param name="rigidbody" type="object">physics object to be used in collision response</param>
        ///  <returns type="void" />
        /// </signature>
        this.rigidBody = rigidBody;
        this.detectOnly = false;
    },
    /* Restricting ability to choose from various shapes for now, while I implement partitioning and phase systems.
    SetBoundingShape: function(shape) {

        var index = GM.models.indexOf(this.activeFrame);

        if (shape == BoundingShapes.aabb) {
            this.activeShape = this.aabb;
            GM.models[index] = this.activeFrame = new ModelHandler(new Primitives.Cube(this.aabb.radii, false), this.shapeData);
        }
        else if (shape == BoundingShapes.sphere) {
            this.activeShape = this.sphere;
            GM.models[index] = this.activeFrame = new ModelHandler(new Primitives.IcoSphere(1, this.sphere.radius), this.shapeData);
        }
        this.activeFrame.MakeWireFrame();
        this.activeFrame.colourTint.SetValues(1.0, 1.0, 0.0);
    },
    */
    SetDetectionCall: function(Callback) {
        /// <signature>
        ///  <summary>Will be called every frame for every object in the collision area</summary>
        ///  <param name="Callback" type="function">should include collider param which will be the object that entered the collision area</param>
        ///  <returns type="void" />
        /// </signature>
        this.DetectionCallback = Callback;
    },
    SetResponseCall: function(Callback) {
        /// <signature>
        ///  <summary>Will be called every frame for every object in the collision area</summary>
        ///  <param name="Callback" type="function">should include collider param which will be the object that entered the collision area</param>
        ///  <returns type="void" />
        /// </signature>
        this.ResponseCallback = Callback;
    },
    Update: function() {
        this.sphere.pos = this.trfm.pos;
        //this.aabb.pos = this.trfm.pos;
        var mostScale = this.trfm.GetLargestScaleValue();
        this.sphere.radius = this.shapeData.radius * mostScale;
        //this.aabb.radii = this.shapeData.radii.GetScaleByVec(this.trfm.scale);

        /*
        if(DEBUG) {
            if(this.sphere) {
                this.shell.trfm.scale.SetValues(mostScale, mostScale, mostScale);
            }
            else
                this.shell.trfm.scale.SetCopy(this.aabb.radii);
        }
        */
    }
};

var CollisionNetwork = (function() {

    var colls = [];

    function Partitioning() {

    }
    function BroadPhase() {

    }
    function MidPhase() {

    }
    function NarrowPhase() {

    }

    return {
        AddBody: function(collisionBody) {
            colls.push(collisionBody);
        },
        RemoveBody: function() {
        },
        Update: function() {
            // I believe this would essentially be the broadphase check
            for(var i = 0; i < colls.length; i++) {
                if(colls[i].active) {
                    for (var j = i + 1; j < colls.length; j++) {
                        if(colls[j].active) {
                            var collisionDist = colls[i].sphere.IntersectsSphere(colls[j].sphere);
                            if(collisionDist) {
                                if(colls[i].detectOnly || colls[j].detectOnly) {
                                    colls[i].DetectionCallback(colls[j]);
                                    colls[j].DetectionCallback(colls[i]);
                                }
                                // If they are set to have response, they both must have rigidbodies
                                else {
                                    var netVel = colls[i].rigidBody.GetNetVelocity(colls[j].rigidBody);
                                    if(netVel.GetDot(collisionDist) < 0) {
                                        colls[i].ResponseCallback(colls[j]);
                                        colls[j].ResponseCallback(colls[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
)();
