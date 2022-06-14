import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import foodsData from '../data/foodsData';
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import SceneBase from '../SceneView/Scene/SceneBase';

export default class FoodManager {

    constructor(sceneView) {

        
        this.sceneView = sceneView
    }

    load() {
        const loader = new GLTFLoader();

        loader.load( '/assets/food/scene.gltf', ( gltf ) => {

            this.ressources = gltf.scene    

            this.foods = []

            foodsData.foodsData.forEach(food => this.addFood(food.name, food.position))

            

        }, undefined, function ( error ) {
            console.error( error );
        } );
    }

    addFood(name, {x, y, z}) {
        const food = this.ressources.getObjectByName(name).children[0] // Mesh

        // food.scale.set(1, 1, 1)
                
        food.position.set(x, y, z)
        
        this.sceneView.scene.add(food)
    }

}