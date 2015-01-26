﻿
function CollisionBody(shapeData, trfm) {
    /// <signature>
    ///  <summary>Add collision body to gameobject</summary>
    ///  <param name="shapeData" type="object">Data container describing the object's relative shape</param>
    ///  <param name="trfm" type="Transform">Transform of GameObject</param>
    ///  <returns type="CollisionBody" />
    /// </signature>

    this.trfm = trfm;
    this.shapeData = shapeData;

    // Sphere is first tier of detection
    this.sphere = new Sphere(this.trfm.pos, shapeData.radius);
    // AABB is second tier of detection off the start
    this.tier2Shape = new AABB(this.trfm.pos, shapeData.radii);

    this.active = true;
    this.detectOnly = true;
    // These all hold generic bs so I don't have to check if it exists every frame;
    this.DetectionCallback = function(collider){};
    this.ResponseCallback = function(collider){};
    this.rigidBody = new RigidBody(new Transform(), 1.0);
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
    SetTier2Shape: function(shape) {
        if(shape == BoundingShapes.aabb) {

        }
        else if(shape == BoundingShapes.orientedBB) {
            this.tier2Shape = new OrientedBB();
        }
        else if(shape == BoundingShapes.cylinder) {
            this.tier2Shape = new Cylinder();
        }
    },
    ResizeBoundingShapes: function(shapeData) {
        this.shapeData = shapeData;
        this.sphere.radius = shapeData.radius;
    },
    /* Restricting ability to choose from various shapes for now, while I implement partitioning and phase systems.
    SetBoundingShape: function(shape) {

        var index = GameMngr.models.indexOf(this.activeFrame);

        if (shape == BoundingShapes.tier2Shape) {
            this.activeShape = this.tier2Shape;
            GameMngr.models[index] = this.activeFrame = new ModelHandler(new Primitives.Cube(this.tier2Shape.radii, false), this.shapeData);
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
        //this.tier2Shape.pos = this.trfm.pos;
        var mostScale = this.trfm.GetLargestScaleValue();
        this.sphere.radius = this.shapeData.radius * mostScale;
        //this.tier2Shape.radii = this.shapeData.radii.GetScaleByVec(this.trfm.scale);
    }
};

// The pair of objects to move through the phases of collision checking
function PotentialContact() {
    this.body = [];
}

// Binary Search Tree Node
function BoundingVolumeNode () {
    this.children = [];
    this.parentShape;
    this.body = null;
}
BoundingVolumeNode.prototype = {
    Isleaf: function() {
        return this.collider != null;
    },
    GetPotentialContactsWith: function(otherNode, contacts, limit) {
        if(!this.Overlaps(otherNode) || limit == 0)
            return 0;

        if(this.Isleaf() && otherNode.Isleaf()) {
            contacts.body[0] = this.body;
            contacts.body[1] = otherNode.body;
            return 1;
        }

        var count = 0;
        if(otherNode.Isleaf() || (!this.Isleaf() && this.parentShape.GetSize() >= otherNode.parentShape.GetSize())) {
            // recurse into self
            count = this.children[0].GetPotentialContactsWith(otherNode, contacts, limit);
            // Check whether there are enough slots to do the other side too.
            if(limit > count) {
                return count + this.children[1].GetPotentialContactsWith(otherNode, contacts + count, limit - count);
            }
            else {
                return count;
            }
        }
        else {
            // recurse into other node
            count = this.GetPotentialContactsWith(otherNode.children[0], contacts, limit);
            // Check whether there are enough slots to do the other side too.
            if(limit > count) {
                return count + this.GetPotentialContactsWith(otherNode.children[1], contacts + count, limit - count);
            }
            else {
                return count;
            }
        }
    },
    GetPotentialContacts: function(contacts, limit) {
        if(this.Isleaf() || limit == 0)
            return 0;

        return this.children[0].GetPotentialContactsWith(this.children[1], contacts, limit);
    },
    Overlaps: function(otherNode) {
        return this.body.Overlaps(otherNode.body);
    }
};

function CollisionNetwork() {

    this.colls = [];

    function Partitioning() {

    }

    function BroadPhase() {

    }

    function MidPhase() {

    }

    function NarrowPhase() {

    }
}
CollisionNetwork.prototype = {
    AddBody: function (collisionBody) {
        this.colls.push(collisionBody);
    },
    RemoveBody: function () {
    },
    Update: function () {
        // I believe this would essentially be the broadphase check
        for (var i = 0; i < this.colls.length; i++) {
            if (this.colls[i].active) {
                for (var j = i + 1; j < this.colls.length; j++) {
                    if (this.colls[j].active) {
                        var collisionDist = this.colls[i].sphere.IntersectsSphere(this.colls[j].sphere);
                        if (collisionDist) {
                            if (this.colls[i].detectOnly || this.colls[j].detectOnly) {
                                this.colls[i].DetectionCallback(this.colls[j]);
                                this.colls[j].DetectionCallback(this.colls[i]);
                            }
                            // If they are set to have response, they both must have rigidbodies
                            else {
                                var netVel = this.colls[i].rigidBody.GetNetVelocity(this.colls[j].rigidBody);
                                if (netVel.GetDot(collisionDist) < 0) {
                                    this.colls[i].ResponseCallback(this.colls[j]);
                                    this.colls[j].ResponseCallback(this.colls[i]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
