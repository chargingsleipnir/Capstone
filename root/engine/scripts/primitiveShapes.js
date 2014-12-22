
var Primitives = {
    Ray: function() {

    },
    AxesPositive: function(scaleVec) {
        var x, y, z;
        if(scaleVec) {
            x = scaleVec.x;
            y = scaleVec.y;
            z = scaleVec.z;
        }
        else
            x = y = z = 1.0;

        return {
            name: "Positive Axes",
            numTris: 0,
            materials: [],
            vertices: {
                byMesh: {
                    count: 4,
                    posCoords: [
                        0.0, 0.0, 0.0,
                        x, 0.0, 0.0,
                        0.0, y, 0.0,
                        0.0, 0.0, z
                    ],
                    colElems: [],
                    texCoords: [],
                    normAxes: [],
                    indices: []
                },
                byFaces: {
                    count: 6,
                    posCoords: [
                        0.0, 0.0, 0.0,
                        x, 0.0, 0.0,
                        0.0, 0.0, 0.0,
                        0.0, y, 0.0,
                        0.0, 0.0, 0.0,
                        0.0, 0.0, z
                    ],
                    colElems: [
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0,
                        0.0, 0.8, 0.0,
                        0.0, 0.8, 0.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0
                    ],
                    texCoords: [],
                    normAxes: []
                }
            },
            drawMethod: DrawMethods.lines
        };
    },
    axesNegative: {
        name: "Negative Axes",
        numTris: 0,
        materials: [],
        vertices: {
            byMesh: {
                count: 0,
                posCoords: [],
                colElems: [],
                texCoords: [],
                normAxes: [],
                indices: []
            },
            byFaces: {
                count: 300,
                posCoords: (function () {
                    var vertices = [];
                    for (var i = 0.0; i > -100; i--)
                        vertices = vertices.concat([i, 0.0, 0.0]);
                    for (var i = 0.0; i > -100; i--)
                        vertices = vertices.concat([0.0, i, 0.0]);
                    for (var i = 0.0; i > -100; i--)
                        vertices = vertices.concat([0.0, 0.0, i]);
                    return vertices;
                })(),
                colElems: (function () {
                    var colors = [];
                    for (var i = 0; i < 100; i++)
                        colors = colors.concat([1.0, 0.0, 0.0]);
                    for (var i = 0; i < 100; i++)
                        colors = colors.concat([0.0, 0.8, 0.0]);
                    for (var i = 0; i < 100; i++)
                        colors = colors.concat([0.0, 0.0, 1.0]);
                    return colors;
                })(),
                texCoords: [],
                normAxes: []
            }
        },
        drawMethod: DrawMethods.points
    },
    axesZeroPoints: {
        name: "Zero Axes",
        numTris: 0,
        materials: [],
        vertices: {
            byMesh: {
                count: 600,
                posCoords: (function () {
                    var vertices = [];
                    for (var i = 100.0; i >= -100; i--)
                        vertices = vertices.concat([i, 0.0, 0.0]);
                    for (var i = 100.0; i >= -100; i--)
                        vertices = vertices.concat([0.0, i, 0.0]);
                    for (var i = 100.0; i >= -100; i--)
                        vertices = vertices.concat([0.0, 0.0, i]);
                    return vertices;
                })(),
                colElems: [],
                texCoords: [],
                normAxes: [],
                indices: []
            },
            byFaces: {
                count: 600,
                posCoords: (function () {
                    var vertices = [];
                    for (var i = 100.0; i >= -100; i--)
                        vertices = vertices.concat([i, 0.0, 0.0]);
                    for (var i = 100.0; i >= -100; i--)
                        vertices = vertices.concat([0.0, i, 0.0]);
                    for (var i = 100.0; i >= -100; i--)
                        vertices = vertices.concat([0.0, 0.0, i]);
                    return vertices;
                })(),
                colElems: (function () {
                    var colors = [];
                    for (var i = -100; i <= 100; i++)
                        colors = colors.concat([1.0, 0.0, 0.0]);
                    for (var i = -100; i <= 100; i++)
                        colors = colors.concat([0.0, 0.8, 0.0]);
                    for (var i = -100; i <= 100; i++)
                        colors = colors.concat([0.0, 0.0, 1.0]);
                    return colors;
                })(),
                texCoords: [],
                normAxes: []
            }
        },
        drawMethod: DrawMethods.points
    },
    grid: {
        name: "Grid",
        numTris: 800,
        materials: [],
        vertices: {
            byMesh: {
                count: 400,
                posCoords: (function () {
                    var vertices = [];
                    for (var x = -10; x < 10; x++)
                        for (var z = -10; z < 10; z++) {
                            vertices = vertices.concat([z, 0.0, x]);
                        }
                    return vertices;
                })(),
                colElems: (function () {
                    var colors = [];
                    var color;
                    for (var x = -10; x < 10; x++)
                        for (var z = -10; z < 10; z++) {
                            if ((x + z) % 2 == 0)
                                color = [0.4, 0.4, 0.4];
                            else
                                color = [0.6, 0.6, 0.6];
                            colors = colors.concat(color);
                        }
                    return colors;
                })(),
                texCoords: [],
                normAxes: [],
                indices: []
            },
            byFaces: {
                count: 2400,
                posCoords: (function () {
                    var vertices = [];
                    for (var x = -10; x < 10; x++)
                        for (var z = -10; z < 10; z++) {
                            vertices = vertices.concat([z + 1, 0.0, x]);
                            vertices = vertices.concat([z, 0.0, x]);
                            vertices = vertices.concat([z, 0.0, x + 1]);
                            vertices = vertices.concat([z + 1, 0.0, x]);
                            vertices = vertices.concat([z + 1, 0.0, x + 1]);
                            vertices = vertices.concat([z, 0.0, x + 1]);
                        }
                    return vertices;
                })(),
                colElems: (function () {
                    var colors = [];
                    var color;
                    for (var x = -10; x < 10; x++)
                        for (var z = -10; z < 10; z++) {
                            if ((x + z) % 2 == 0)
                                color = [0.4, 0.4, 0.4];
                            else
                                color = [0.6, 0.6, 0.6];
                            colors = colors.concat(color);
                            colors = colors.concat(color);
                            colors = colors.concat(color);
                            colors = colors.concat(color);
                            colors = colors.concat(color);
                            colors = colors.concat(color);
                        }
                    return colors;
                })(),
                texCoords: [],
                normAxes: []
            }
        },
        drawMethod: DrawMethods.triangles
    },
    axesGrid: {
        name: "Grid Axes",
        numTris: 0,
        materials: [],
        vertices: {
            byMesh: {
                count: 0,
                posCoords: [],
                colElems: [],
                texCoords: [],
                normAxes: [],
                indices: []
            },
            byFaces: {
                count: 600,
                posCoords: (function () {
                    var vertices = [];
                    // Treating i and j as all three planes
                    for (var i = -10; i <= 10; i++) {
                        for (var j = -10; j <= 10; j++) {
                            vertices = vertices.concat([-10.0, i, j]);
                            vertices = vertices.concat([10.0, i, j]);
                            vertices = vertices.concat([i, -10.0, j]);
                            vertices = vertices.concat([i, 10.0, j]);
                            vertices = vertices.concat([i, j, -10.0]);
                            vertices = vertices.concat([i, j, 10.0]);
                        }
                    }
                    return vertices;
                })(),
                colElems: (function () {
                    var colors = [];
                    // Treating i and j as all three planes
                    for (var i = -10; i <= 10; i++) {
                        for (var j = -10; j <= 10; j++) {
                            /*
                             colors = colors.concat([1.0, 0.0, 0.0]);
                             colors = colors.concat([1.0, 0.0, 0.0]);
                             colors = colors.concat([0.0, 0.8, 0.0]);
                             colors = colors.concat([0.0, 0.8, 0.0]);
                             colors = colors.concat([0.0, 0.0, 1.0]);
                             colors = colors.concat([0.0, 0.0, 1.0]);
                             */
                            colors = colors.concat([1.0, 0.75, 0.75]);
                            colors = colors.concat([1.0, 0.75, 0.75]);
                            colors = colors.concat([0.75, 1.0, 0.75]);
                            colors = colors.concat([0.75, 1.0, 0.75]);
                            colors = colors.concat([0.75, 0.75, 1.0]);
                            colors = colors.concat([0.75, 0.75, 1.0]);
                        }
                    }
                    return colors;
                })(),
                texCoords: [],
                normAxes: []
            }
        },
        drawMethod: DrawMethods.lines
    },
    Rect: function (radii) {
        var w, h;
        if(radii) {
            w = radii.x;
            h = radii.y;
        }
        else {
            w = h = 1.0;
        }

        var posCoords = [
            -w, h, 0.0,
            -w, -h, 0.0,
            w, -h, 0.0,
            w, h, 0.0
        ];
        var normals = [];
        var colours = [];
        for (var i = 0; i < posCoords.length; i += 3) {
            var magInv = 1.0 / (new Vector3(posCoords[i], posCoords[i + 1], 0.0)).GetMag();
            normals = normals.concat([posCoords[i] * magInv, posCoords[i + 1] * magInv, 0.0]);
            colours = colours.concat([0.0, 0.0, 0.0]);
        }
        return {
            name: "Rect",
            numTris: 2,
            materials: [],
            vertices: {
                byMesh: {
                    count: 4,
                    posCoords: posCoords,
                    colElems: colours,
                    texCoords: [
                        /* This is inconsistent with order of indices,
                        but seems to be the only way it works...??? */
                        0.0, 1.0,
                        0.0, 0.0,
                        1.0, 0.0,

                        1.0, 1.0,
                        1.0, 0.0,
                        0.0, 0.0
                    ],
                    normAxes: normals,
                    indices: [
                        0, 1, 2,
                        0, 2, 3
                    ]
                },
                byFaces: {
                    count: 6,
                    posCoords: [],
                    colElems: [],
                    texCoords: [],
                    normAxes: []
                }
            },
            drawMethod: DrawMethods.triangles
        }
    },
    heart: {
        name: "Heart",
        numTris: 6,
        materials: [],
        vertices: {
            byMesh: {
                count: 8,
                posCoords: [
                    0.0, 0.2, 0.0,
                    -0.1, 0.3, 0.0,
                    -0.2, 0.3, 0.0,
                    -0.3, 0.1, 0.0,
                    0.0, -0.3, 0.0,
                    0.3, 0.1, 0.0,
                    0.2, 0.3, 0.0,
                    0.1, 0.3, 0.0
                ],
                colElems: [
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0
                ],
                texCoords: [],
                normAxes: [],
                indices: [0, 1, 2, 3, 4, 5, 6, 7]
            },
            byFaces: {
                count: 8,
                posCoords: [],
                colElems: [],
                texCoords: [],
                normAxes: []
            }
        },
        drawMethod: DrawMethods.triangleFan
    },
    bolt: {
        name: "Bolt",
        numTris: 4,
        materials: [],
        vertices: {
            byMesh: {
                count: 6,
                posCoords: [
                    0.2, 0.3, 0.0,
                    -0.2, 0.1, 0.0,
                    0.0, 0.1, 0.0,

                    0.0, -0.1, 0.0,
                    0.2, -0.1, 0.0,
                    -0.2, -0.3, 0.0
                ],
                colElems: [
                    0.8, 0.8, 0.0,
                    0.8, 0.8, 0.0,
                    0.8, 0.8, 0.0,
                    0.8, 0.8, 0.0,
                    0.8, 0.8, 0.0,
                    0.8, 0.8, 0.0
                ],
                texCoords: [],
                normAxes: [],
                indices: [0, 1, 2, 3, 4, 5]
            },
            byFaces: {
                count: 6,
                posCoords: [],
                colElems: [],
                texCoords: [],
                normAxes: []
            }
        },
        drawMethod: DrawMethods.triangleStrip
    },
    arrow: {
        name: "Arrow",
        numTris: 10,
        materials: [],
        vertices: {
            byMesh: {
                count: 10,
                posCoords: [
                    // head
                    0.0, 0.3, 0.0,
                    -0.15, 0.1, 0.15,
                    0.15, 0.1, 0.15,
                    0.15, 0.1, -0.15,
                    -0.15, 0.1, -0.15,
                    // tail
                    0.0, 0.1, 0.1,
                    0.1, 0.1, 0.0,
                    0.0, 0.1, -0.1,
                    -0.1, 0.1, 0.0,
                    0.0, -0.4, 0.0
                ],
                colElems: (function () {
                    var colors = [];
                    for (var i = 0; i < 10; i++) {
                        colors = colors.concat([Math.sin(i), Math.cos(i), Math.tan(i)]);
                    }
                    return colors;
                })(),
                texCoords: [],
                normAxes: [],
                indices: [
                    0, 1, 2,
                    0, 2, 3,
                    0, 3, 4,
                    0, 4, 1,

                    1, 2, 3,
                    2, 3, 4,

                    5, 6, 9,
                    6, 7, 9,
                    7, 8, 9,
                    8, 5, 9
                ]
            },
            byFaces: {
                count: 30,
                posCoords: [],
                colElems: [],
                texCoords: [],
                normAxes: []
            }
        },
        drawMethod: DrawMethods.triangles
    },
    Cube: function (radii, canTexture) {

        var w, h, d;
        if(radii) {
            w = radii.x;
            h = radii.y;
            d = radii.z;
        }
        else
            w = h = d = 1.0;

        var posCoords = [
            -w, h, -d,
            -w, -h, -d,
            w, -h, -d,
            w, h, -d,

            -w, h, d,
            -w, -h, d,
            w, -h, d,
            w, h, d
        ];
        var normals = [];
        var colours = [];
        for (var i = 0; i < posCoords.length; i += 3) {
            var magInv = 1.0 / (new Vector3(posCoords[i], posCoords[i + 1], posCoords[i + 2])).GetMag();
            normals = normals.concat([posCoords[i] * magInv, posCoords[i + 1] * magInv, posCoords[i + 2] * magInv]);
            colours = colours.concat([0.0, 0.0, 0.0]);
        }
        var texCoords = [];
        if (canTexture)
            texCoords = [
                0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
                0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

                0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
                0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

                0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
                0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

                0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
                0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

                0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
                0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

                0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
                0.0, 1.0, 1.0, 0.0, 1.0, 1.0
            ];

        return {
            name: "Cube",
            numTris: 12,
            materials: [],
            vertices: {
                byMesh: {
                    count: 8,
                    posCoords: posCoords,
                    colElems: colours,
                    texCoords: [],
                    normAxes: normals,
                    indices: [
                        // back
                        3, 2, 1,
                        3, 1, 0,
                        // left
                        0, 1, 5,
                        0, 5, 4,
                        // front
                        4, 5, 6,
                        4, 6, 7,
                        // right
                        7, 6, 2,
                        7, 2, 3,
                        // top
                        4, 0, 7,
                        7, 0, 3,
                        // bottom
                        1, 5, 2,
                        2, 5, 6
                    ]
                },
                byFaces: {
                    count: 36,
                    posCoords: [
                        // back
                        w, h, -d,
                        w, -h, -d,
                        -w, -h, -d,
                        w, h, -d,
                        -w, -h, -d,
                        -w, h, -d,
                        // left
                        -w, h, -d,
                        -w, -h, -d,
                        -w, -h, d,
                        -w, h, -d,
                        -w, -h, d,
                        -w, h, d,
                        // front
                        -w, h, d,
                        -w, -h, d,
                        w, -h, d,
                        -w, h, d,
                        w, -h, d,
                        w, h, d,
                        // right
                        w, h, d,
                        w, -h, d,
                        w, -h, -d,
                        w, h, d,
                        w, -h, -d,
                        w, h, -d,
                        // top
                        -w, h, -d,
                        -w, h, d,
                        w, h, d,
                        -w, h, -d,
                        w, h, d,
                        w, h, -d,
                        // bottom
                        -w, -h, d,
                        -w, -h, -d,
                        w, -h, -d,
                        -w, -h, d,
                        w, -h, -d,
                        w, -h, d
                    ],
                    colElems: [],
                    texCoords: texCoords,
                    normAxes: []
                }
            },
            drawMethod: DrawMethods.triangles
        };
    },
    IcoSphere: function (recursionLevel, radius) {
        var posCoords = [
            // zy plane, 1:2 size
            -0.25, 0.5, 0.0,
            -0.25, -0.5, 0.0,
            0.25, -0.5, 0.0,
            0.25, 0.5, 0.0,
            // yz plane,  1:2 size
            0.0, 0.25, 0.5,
            0.0, 0.25, -0.5,
            0.0, -0.25, -0.5,
            0.0, -0.25, 0.5,
            // xz plane, 2:1 size
            0.5, 0.0, -0.25,
            -0.5, 0.0, -0.25,
            -0.5, 0.0, 0.25,
            0.5, 0.0, 0.25
        ];
        var indices = [
            // 5 faces around vert 0
            0, 10, 4,
            0, 4, 3,
            0, 3, 5,
            0, 5, 9,
            0, 9, 10,
            // 5 faces sharing sides with those
            10, 7, 4,
            4, 11, 3,
            3, 8, 5,
            5, 6, 9,
            9, 1, 10,
            // 5 faces sharing vert 2
            2, 8, 6,
            2, 6, 1,
            2, 1, 7,
            2, 7, 11,
            2, 11, 8,
            // 5 faces sharing sides with those
            8, 5, 6,
            6, 9, 1,
            1, 10, 7,
            7, 4, 11,
            11, 3, 8
        ];

        var indexRecord = [];

        function getMidPoint(index1, index2) {
            var smallerIndex = (index1 < index2) ? index1 : index2;
            var greaterIndex = (index1 > index2) ? index1 : index2;

            for (var i = 0; i < indexRecord.length; i++)
                if (indexRecord[i][0] == smallerIndex && indexRecord[i][1] == greaterIndex)
                    return i;

            var vert1 = vertPositions[index1];
            var vert2 = vertPositions[index2];
            var newVert = [
                (vert1[0] + vert2[0]) / 2,
                (vert1[1] + vert2[1]) / 2,
                (vert1[2] + vert2[2]) / 2
            ];

            var i = vertPositions.add(newVert);
            indexRecord[i] = [smallerIndex, greaterIndex];
            return i;
        }

        var index = 0;
        var vertPositions = [];
        if (!radius)
            radius = 1.0;
        vertPositions.add = function (vec3Data) {
            var magInv = 1.0 / Math.sqrt((vec3Data[0] * vec3Data[0]) + (vec3Data[1] * vec3Data[1]) + (vec3Data[2] * vec3Data[2]));
            this.push([vec3Data[0] * magInv, vec3Data[1] * magInv, vec3Data[2] * magInv]);
            indexRecord[index] = [index, index];
            return index++;
        };
        for (var x = 0; x < posCoords.length; x += 3)
            vertPositions.add([posCoords[x], posCoords[x + 1], posCoords[x + 2]]);


        var faces = [];
        for (var i = 0; i < indices.length; i += 3)
            faces.push([indices[i], indices[i + 1], indices[i + 2]]);


        for (var i = 0; i < recursionLevel; i++) {
            var faces2 = [];
            for (var j = 0; j < faces.length; j++) {
                var midA = getMidPoint(faces[j][0], faces[j][1]);
                var midB = getMidPoint(faces[j][1], faces[j][2]);
                var midC = getMidPoint(faces[j][2], faces[j][0]);

                faces2.push([faces[j][0], midA, midC]);
                faces2.push([faces[j][1], midB, midA]);
                faces2.push([faces[j][2], midC, midB]);
                faces2.push([midA, midB, midC]);
            }
            faces = faces2;
        }

        posCoords = [];
        normals = [];
        var texCoords = [];
        var r = 1.0;
        var texBound = 0.75;
        var pivotPoint = [0, 0, 1];
        for (var i = 0; i < vertPositions.length; i++) {
            for (var j = 0; j < vertPositions[i].length; j++) {
                normals.push(vertPositions[i][j]);
                posCoords.push(vertPositions[i][j] * radius);
            }

            var x = vertPositions[i][0], y = vertPositions[i][1], z = vertPositions[i][2];

            // This hacky little adjustment pretty much completely kills the seem by just making sure it's a little off the zero mark. Nice!

            if (z < -0.15)
                pivotPoint[2] = -1;
            else
                pivotPoint[2] = 1;

            // calculate arcLength from  point [0,0,1] to each vertex
            var w = Math.sqrt(Math.pow(x - pivotPoint[0], 2) + Math.pow(y - pivotPoint[1], 2) + Math.pow(z - pivotPoint[2], 2));
            var arcLength = 2 * r * Math.asin(w / (2 * r));

            var theta = Math.atan2(y, x);
            var xComp = arcLength * Math.cos(theta);
            var yComp = arcLength * Math.sin(theta);

            texCoords = texCoords.concat([xComp, yComp]);
        }

        indices = [];
        var colors = [];
        for (var i = 0; i < faces.length; i++) {
            for (var j = 0; j < faces[i].length; j++) {
                indices.push(faces[i][j]);
                //colors = colors.concat([1.0, 1.0, 1.0]);
                colors = colors.concat([0.0, 0.0, 0.0]);
            }
        }

        return {
            name: "IcoSphere",
            numTris: indices.length / 3,
            materials: [],
            vertices: {
                byMesh: {
                    count: posCoords.length / 3,
                    posCoords: posCoords,
                    colElems: colors,
                    texCoords: texCoords,
                    normAxes: normals,
                    indices: indices
                },
                byFaces: {
                    count: indices.length,
                    posCoords: [],
                    colElems: [],
                    texCoords: [],
                    normAxes: []
                }
            }
        };
    },
    UVSphere: function() {
        /*
         // UV SPHERE - incomplete

         var longRings = 6;
         var latRings = 6;
         var radius = 0.5;

         var normals = [0.0, 0.0, -1.0];
         var vertices = [0.0, 0.0, 0.0];
         var colors = [1.0, 1.0, 0.0, 1.0];
         this.alpha = 1.0;
         var incLong = Math.PI / longRings;
         var incLat = Math.PI / latRings;
         /*
         for (var i = 0; i <= longRings ; i++) {
         var theta = incLong * i;
         var x = Math.cos(theta);
         var y = Math.sin(theta);
         var z = 0.0;
         normals = normals.concat([0.0, 0.0, -1.0]);
         vertices = vertices.concat([x, y, z]);
         colors = colors.concat([x, y, z, this.alpha]);
         //console.log("Theta: " + theta + ", X: " + x + ", Y: " + y);
         }
         for (var i = 0; i <= longRings; i++) {
         var theta = incLong * i;
         var cosTheta = Math.cos(theta);
         var sinTheta = Math.sin(theta);
         for (var j = 0; j <= latRings; j++) {
         var phi = incLat * j;
         var x = Math.cos(phi);
         var z = Math.sin(phi);
         }
         normals = normals.concat([0.0, 0.0, -1.0]);
         vertices = vertices.concat([x, y, z]);
         colors = colors.concat([x, y, z, this.alpha]);
         //console.log("Theta: " + theta + ", X: " + x + ", Y: " + y);
         }
         this.vertSize = 3;
         this.numVerts = longRings + 2; // Extra first and extra last
         this.colorSize = 4;
         this.numColors = this.numVerts;
         */
        //console.log("Vertices: " + vertices.length + ", Normals: " + normals.length + ", Colors: " + colors.length);
        return {

        };
    }
};