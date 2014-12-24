
function GameObject(name, label) {
    this.name = name;
    this.label = label;

    this.parent = null;
    this.children = [];
    this.components = [];
    this.scripts = [];

    this.shape = new AAShapeData3D();

    this.trfmLocal = new Transform(Space.local);
    this.trfmGlobal = new Transform(Space.global);

    if(DEBUG) {
        //this.dirDisplay = new DebugDispObj(new ModelHandler(new Primitives.AxesPositive(), this.shape), new Transform());
        //DM.dispObjs.push(this.dirDisplay);
    }
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
            this.components.push(this.camera);
        }
        else if (component == Components.modelHandler) {
            if(this.model) {
                this.mdlHdlr = new ModelHandler(this.model, this.shape);
                // Add controller to draw call;
                GM.models.push(this.mdlHdlr);
            }
        }
        else if (component == Components.rigidBody) {
            this.rigidBody = new RigidBody(this.trfmLocal, this.shape.radius);
            if(this.collider)
                this.collider.SetRigidBody(this.rigidBody);
            this.components.push(this.rigidBody);
        }
        else if (component == Components.collisionBody) {
            this.collider = new CollisionBody(this.shape, this.trfmGlobal);
            if(this.rigidBody)
                this.collider.SetRigidBody(this.rigidBody);
            this.components.push(this.collider);
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
    AddScript: function(scriptObj) {
        /// <signature>
        ///  <summary>Script must have Initialize(gameObject) and Update() functions</summary>
        ///  <param name="scriptObj" type="new Object"></param>
        ///  <returns type="void" />
        /// </signature>
        scriptObj.Initialize(this);
        this.scripts.push(scriptObj);
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
        this.shape = GeomUtils.GetShapeData3D(vertData.posCoords, true);

        if(DEBUG && this.trfmGlobal.space == Space.global) {
            var axesLengths = this.shape.radii.GetScaleByVec(this.trfmGlobal.scale.SetScaleByNum(1.25));
            this.trfmGlobal.orientDisplay.model = new ModelHandler(new Primitives.OrientAxes(axesLengths), this.shape);
            this.trfmGlobal.orientDisplay.model.active = DM.ShowQuatOrientationAxes ? true : false;
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
            this.trfmGlobal.SetOrient(this.trfmLocal.orient.GetMultiplyQuat(trfmParent.orient));
            this.trfmGlobal.SetScaleVec3(this.trfmLocal.scale.GetScaleByVec(trfmParent.scale));

            this.trfmGlobal.dirFwd.SetCopy(this.trfmLocal.dirFwd);
            //this.trfmGlobal.dirFwd.Add(trfmParent.dirFwd);
            this.trfmGlobal.dirUp.SetCopy(this.trfmLocal.dirUp);
            //this.trfmGlobal.dirUp.Add(trfmParent.dirUp);
            this.trfmGlobal.dirRight.SetCopy(this.trfmLocal.dirRight);

            this.trfmGlobal.IsChanging();

            if(DEBUG) {
                //this.dirDisplay.trfm.pos.SetCopy(this.trfmGlobal.pos);
                //this.dirDisplay.trfm.orient.SetCopy(this.trfmGlobal.orient);

                /*
                var newVertData = [];
                var zeroVec = new Vector3();
                newVertData = newVertData.concat(zeroVec.GetData());
                newVertData = newVertData.concat(this.trfmLocal.dirRight.GetData());
                newVertData = newVertData.concat(zeroVec.GetData());
                newVertData = newVertData.concat(this.trfmLocal.dirUp.GetData());
                newVertData = newVertData.concat(zeroVec.GetData());
                newVertData = newVertData.concat(this.trfmLocal.dirFwd.GetData());
                newVertData = newVertData.concat(this.dirDisplay.model.vertData.colElems);
                this.dirDisplay.model.RewriteVerts(newVertData);
                */

                //DEBUG = false;
            }

            if (this.mdlHdlr)
                this.mdlHdlr.UpdateModelViewControl(this.trfmGlobal);
        }

        // Scripts first?? Sure...
        for (var i in this.scripts)
            this.scripts[i].Update();

        for (var i in this.components)
            this.components[i].Update();

        for (var i in this.children) {
            // Have each gameObject hold it's own model matrix, and multiply each childs matrix into it's parents.
            // Hopefully this will create relative child transformations
            //this.children[i].transform.SetParentMatrix(this.transform.matrix_Model);
            this.children[i].Update(this.trfmGlobal);
        }
        // Once children have changed based on their parent's movement, stop parent activity until set active again.
        this.trfmGlobal.active = false;
    }
};