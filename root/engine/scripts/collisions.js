
function CollisionSphere(objTrfm, radius) {
    Sphere.call(this, objTrfm.pos, radius);
    this.trfm = new Transform(Space.local);
    this.trfm.pos.SetCopy(objTrfm.pos);
    this.trfm.offsetOrient = objTrfm.orient;
}
CollisionSphere.prototype = new Sphere();
CollisionSphere.prototype.SetScale = function(scalar) {
    this.trfm.SetScaleAxes(scalar, scalar, scalar);
};
CollisionSphere.prototype.GetScaled = function() {
    return this.radius * this.trfm.scale.x;
};
CollisionSphere.prototype.SetPosOffset = function(x, y, z) {
    this.trfm.SetOffsetPosAxes(x, y, z);
};
CollisionSphere.prototype.IntersectsSphere = function(sphere) {
    return this.trfm.pos.GetSubtract(sphere.trfm.pos).GetMagSqr() <= Math.pow(this.GetScaled() + sphere.GetScaled(), 2);
};
CollisionSphere.prototype.Callback = function(collider){};
CollisionSphere.prototype.Update = function(trfm) {
    var newLocalPos = trfm.orient.GetMultiplyVec3(this.trfm.offsetPos);
    this.pos = this.trfm.pos = newLocalPos.GetAdd(trfm.pos);

    //this.pos = this.trfm.pos = trfm.pos.GetAdd(this.trfm.offsetPos);
    this.SetScale(trfm.GetLargestScaleValue());

    console.log(trfm.pos.GetData());
};

function CollisionSystem(shapeData, trfm) {
    /// <signature>
    ///  <summary>Add collision body to gameobject</summary>
    ///  <param name="shapeData" type="object">Data container describing the object's relative shapeData</param>
    ///  <param name="trfm" type="Transform">Transform of GameObject</param>
    ///  <returns type="CollisionSystem" />
    /// </signature>

    this.trfm = trfm;
    this.shapeData = shapeData;

    // Sphere is first tier of detection
    this.collSphere = new CollisionSphere(this.trfm, shapeData.radius);
    // AABB is second tier of detection off the start
    this.collBox = new OBB(this.trfm.pos, shapeData.radii);

    this.active = true;

    this.rigidBody = new RigidBody(new Transform(), 1.0);
}
CollisionSystem.prototype = {
    SetRigidBody: function(rigidBody) {
        /// <signature>
        ///  <summary>Adding rigidbody will automatically switch detectOnly off and use collision response as well as detection</summary>
        ///  <param name="rigidbody" type="object">physics object to be used in collision response</param>
        ///  <returns type="void" />
        /// </signature>
        this.rigidBody = rigidBody;
    },
    /*
    SetTier1Shape: function(shape) {
        if(shape == BoundingShapes.sphere) {
            this.collSphere = new Sphere();
        }
        else if(shape == BoundingShapes.aabb) {
            this.collSphere = new AABB();
        }
        else if(shape == BoundingShapes.obb) {
            this.collSphere = new OBB();
        }
        else if(shape == BoundingShapes.cylinder) {
            this.collSphere = new Cylinder();
        }
    },
    SetTier2Shape: function(shape) {
        if(shape == BoundingShapes.sphere) {
            this.collSphere = new Sphere();
        }
        else if(shape == BoundingShapes.aabb) {
            this.collSphere = new Sphere();
        }
        else if(shape == BoundingShapes.obb) {
            this.collBox = new OBB();
        }
        else if(shape == BoundingShapes.cylinder) {
            this.collBox = new Cylinder();
        }
    },
    */
    ResizeBoundingShapes: function(shapeData) {
        this.shapeData = shapeData;
        this.collSphere.radius = shapeData.radius;
    },
    /* Restricting ability to choose from various shapes for now, while I implement partitioning and phase systems.
    SetBoundingShape: function(shape) {

        var index = GameMngr.models.indexOf(this.activeFrame);

        if (shape == BoundingShapes.collBox) {
            this.activeShape = this.collBox;
            GameMngr.models[index] = this.activeFrame = new ModelHandler(new Primitives.Cube(this.collBox.radii, false), this.shapeData);
        }
        else if (shape == BoundingShapes.sphere) {
            this.activeShape = this.sphere;
            GameMngr.models[index] = this.activeFrame = new ModelHandler(new Primitives.IcoSphere(1, this.sphere.radius), this.shapeData);
        }
        this.activeFrame.MakeWireFrame();
        this.activeFrame.tint.SetValues(1.0, 1.0, 0.0);

        // DO A DM.REPLACEMODEL...
    },
    */
    SetSphereCall: function(Callback) {
        /// <signature>
        ///  <summary>Will be called every frame for every object in the collision area</summary>
        ///  <param name="Callback" type="function">should include collider param which will be the object that entered the collision area</param>
        ///  <returns type="void" />
        /// </signature>
        this.collSphere.Callback = Callback;
    },
    OffsetSpherePosAxes: function(x, y, z) {
        this.collSphere.SetPosOffset(x, y, z);
    },
    SetOBBCall: function(Callback) {
        /// <signature>
        ///  <summary>Will be called every frame for every object in the collision area</summary>
        ///  <param name="Callback" type="function">should include collider param which will be the object that entered the collision area</param>
        ///  <returns type="void" />
        /// </signature>
        this.collBox.Callback = Callback;
    },
    Update: function() {
        this.collSphere.Update(this.trfm);
    }
};


function CollisionNetwork() {

    this.dynamicColls = [];
    this.staticColls = [];
}
CollisionNetwork.prototype = {
    AddBody: function (collisionBody) {
        this.dynamicColls.push(collisionBody);
    },
    Update: function () {
        for (var i = 0; i < this.dynamicColls.length; i++) {
            if (this.dynamicColls[i].active) {
                for (var j = i + 1; j < this.dynamicColls.length; j++) {
                    if (this.dynamicColls[j].active) {

                        // BROAD-PHASE DETECTION
                        if (this.dynamicColls[i].collSphere.IntersectsSphere(this.dynamicColls[j].collSphere)) {

                            //console.log(this.dynamicColls[i].collSphere.radius);
                            //console.log(this.dynamicColls[j].collSphere.radius);
                            this.dynamicColls[i].collSphere.Callback(this.dynamicColls[j]);
                            this.dynamicColls[j].collSphere.Callback(this.dynamicColls[i]);
                            // MID-PHASE DETECTION
                            //var contactPnt = this.dynamicColls[i].collBox.Intersects(this.dynamicColls[j].collBox);
                            /*
                            if(contactPnt) {
                                this.dynamicColls[i].collBox.Callback(this.dynamicColls[j]);
                                this.dynamicColls[j].collBox.Callback(this.dynamicColls[i]);
                            }
                            */
                        }
                    }
                }
            }
        }
    }
};
