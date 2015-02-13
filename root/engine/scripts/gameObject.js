﻿
function GameObject(name, label) {
    this.name = name;
    this.label = label;

    this.parent = null;
    this.children = [];
    this.components = [];
    this.loopCalls = [];

    this.trfmLocal = new Transform(Space.local);
    this.trfmGlobal = new Transform(Space.global);

    this.shapeData = new AAShapeData3D();
    this.sphere = new Sphere(this.trfmGlobal.pos, this.shapeData.radius);
}
GameObject.prototype = {
    AddChild: function(gameObject) {
        /// <signature>
        ///  <summary>Add a gameObject as a child of the caller</summary>
        ///  <param name="gameObject" type="GameObject">child GameObject to add</param>
        ///  <returns type="void" />
        /// </signature>
        gameObject.parent = this;
        this.children.push(gameObject);
    },
    RemoveChild: function(name) {
        /// <signature>
        ///  <summary>Remove a gameObject from the child list of the caller</summary>
        ///  <param name="name" type="string">name of child object</param>
        ///  <returns type="void" />
        /// </signature>
        //var index = this.children.indexOf(name);
        //this.children.splice(index - 1, 1);
    },
    RemoveChildren: function() {
        /// <signature>
        ///  <summary>Remove all gameObject children from the caller</summary>
        ///  <returns type="void" />
        /// </signature>
        this.children = [];
    },
    /* This will act as a component factory so as to give control of the component
    to the gameobject, as well as having it listed for easy updating */
    AddComponent: function(component) {
        /// <signature>
        ///  <summary>Add a component to the game object</summary>
        ///  <param name="component" type="enum">component to add</param>
        ///  <returns type="void" />
        /// </signature>
        if(component == Components.camera) {
            this.camera = new Camera(this.trfmGlobal);
        }
        else if (component == Components.rigidBody) {
            this.rigidBody = new RigidBody(this.trfmLocal, this.shapeData.radius);
            if(this.collider)
                this.collider.SetRigidBody(this.rigidBody);
            this.components.push(this.rigidBody);
        }
        else if (component == Components.collisionSystem) {
            this.collider = new CollisionSystem(this.shapeData, this.trfmGlobal);
            if(this.rigidBody)
                this.collider.SetRigidBody(this.rigidBody);
            this.components.push(this.collider);
        }
        else if (component == Components.particleSystem) {
            this.ptclSys = new ParticleSystem(this.trfmGlobal);
            this.components.push(this.ptclSys);
        }
    },
    RemoveComponent: function(name) {
        /// <signature>
        ///  <summary>Remove a component from the child list of the caller</summary>
        ///  <param name="name" type="string">name of componemt</param>
        ///  <returns type="void" />
        /// </signature>
        //var index = this.children.indexOf(name);
        //this.children.splice(index - 1, 1);
    },
    RemoveComponents: function() {
        /// <signature>
        ///  <summary>Remove all component children from the caller</summary>
        ///  <returns type="void" />
        /// </signature>
        this.components = [];
    },
    AddLoopCall: function(Callback) {
        /// <signature>
        ///  <summary>Script must have Initialize(gameObject) and Update() functions</summary>
        ///  <param name="Callback" type="function"></param>
        ///  <returns type="void" />
        /// </signature>
        this.loopCalls.push(Callback);
    },
    SetModel: function(model) {
        /// <signature>
        ///  <summary>Add model to gameobject. Required before several components can be added</summary>
        ///  <param name="model" type="object">JSON import or Primitive model</param>
        ///  <returns type="void" />
        /// </signature>
        this.model = model;
        // Make sure the correct set of vertices are being centred.
        var vertData = ModelUtils.SelectVAOData(this.model.vertices);
        this.shapeData = GeomUtils.GetShapeData3D(vertData.posCoords, true);
        this.sphere.SetValues(this.trfmGlobal.pos, this.shapeData.radius);

        this.mdlHdlr = new ModelHandler(this.model, this.trfmGlobal, this.sphere);

        if(this.collisionSystem) {
            this.collisionSystem.ResizeBoundingShapes(this.shapeData);
        }
    },
    Update: function(trfmParent) {
        /// <signature>
        ///  <summary>Update all components, children, and their children</summary>
        ///  <param name="trfmParentGlobal" type="Transform">The transform data of the parent</param>
        ///  <returns type="void" />
        /// </signature>
        if (this.trfmLocal.IsChanging() || trfmParent.IsChanging()) {
            /* I shouldn't need to reset this so long as the check in Transform
             * only deactivates "local" transform updates */
            //trfmParent.active = true;

            // Update global to pass to children
            this.trfmGlobal.SetPosVec3(this.trfmLocal.pos.GetAdd(trfmParent.pos));
            this.trfmGlobal.SetRotation(this.trfmLocal.orient.GetMultiplyQuat(trfmParent.orient));
            this.trfmGlobal.SetScaleVec3(this.trfmLocal.scale.GetScaleByVec(trfmParent.scale));

            this.trfmGlobal.SetOffsetPosVec3(this.trfmLocal.offsetPos.GetAdd(trfmParent.offsetPos));
            this.trfmGlobal.SetOffsetRotation(this.trfmLocal.offsetOrient.GetMultiplyQuat(trfmParent.offsetOrient));

            //this.trfmGlobal.IsChanging();

            // Keep bounding sphere updated for accurate frustum culling
            this.sphere.pos.SetCopy(this.trfmGlobal.pos);
            // Ideally, I would do a better calculation, applying the scale to the shape radii to determine
            // a closer-to-accurate radius.
            this.sphere.radius = this.shapeData.radius * this.trfmGlobal.GetLargestScaleValue();
        }
        else
            this.trfmGlobal.active = false;

        // Scripts first?? Sure...
        for (var i in this.loopCalls)
            this.loopCalls[i]();

        for (var i in this.components)
            this.components[i].Update();

        for (var i in this.children) {
            // Have each gameObject hold it's own model matrix, and multiply each childs matrix into it's parents.
            // Hopefully this will create relative child transformations
            //this.children[i].transform.SetParentMatrix(this.transform.matrix_Model);
            this.children[i].Update(this.trfmGlobal);
        }
    }
};