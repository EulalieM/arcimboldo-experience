import SceneBase from './Scene/SceneBase';
import FoodManager from '../Objects/FoodManager';

export default class SceneView extends SceneBase {

    init () {
        super.init();

        this.isReady = false;

        // HELPERS
        this.setControls();
        this.setHelpers();

        this.foodManager = new FoodManager(this)

        this.setup();
    }

    setup () {
        this.foodManager.load()
        this.isReady = true;
    }

    update () {
        if (this.isReady) {
            // 
        }
    }

}
