import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import foodsData from '../data/foodsData';
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { MathUtils } from 'three';
import TWEEN from 'tween.js';

export default class FoodManager {

    constructor(sceneView) {  
        this.sceneView = sceneView
    }

    load() {
        const loader = new GLTFLoader();

        loader.load( '/assets/food/scene.gltf', ( gltf ) => {

            this.ressources = gltf.scene    

            this.foods = []

            foodsData.forEach(food => this.addFood(food.name, food.position, food.scale, food.rotation))

            this.handleDrag()
            
        }, undefined, function ( error ) {
            console.error( error );
        } );
    }

    addFood(name, position, scale, rotation) {
        const foodModel = this.ressources.getObjectByName(name).children[0] // Mesh

        if (!foodModel) {
            return false;
        }

        const food = foodModel.clone()

        this.foods.push(food)

        food.position.set(position.x, position.y, position.z)

        food.scale.set(scale.x, scale.y, scale.z)

        food.rotation.set(MathUtils.degToRad(rotation.x), MathUtils.degToRad(rotation.y), MathUtils.degToRad(rotation.z))

        this.sceneView.scene.add(food)
    }

    handleDrag() {
        const controls = new DragControls( this.foods, this.sceneView.camera, this.sceneView.renderer.domElement );

        controls.addEventListener( 'dragstart', ( event ) => {
            // this.sceneView.controls.enabled = false
            // event.object.material.emissive.set( 0xaaaaaa );
        } );

        controls.addEventListener ( 'drag', function( event ){
            event.object.position.x = MathUtils.clamp(event.object.position.x, -50, 50);
            event.object.position.y = MathUtils.clamp(event.object.position.y, -20, 20);
            event.object.position.z = MathUtils.clamp(event.object.position.z, -50, 50);

            // event.object.position.x = 0;
            // event.object.position.z = 0;
        })
        
        controls.addEventListener( 'dragend', ( event ) => {
            // this.sceneView.controls.enabled = true
            // event.object.material.emissive.set( 0x000000 );
            this.getFoodPosition()
        } );
    }

    getFoodPosition() {
        this.foods.forEach((element, i) => {
            foodsData[i].position.x = element.position.x
            foodsData[i].position.y = element.position.y
            foodsData[i].position.z = element.position.z
        })
        console.log(JSON.stringify(foodsData))
    }

}