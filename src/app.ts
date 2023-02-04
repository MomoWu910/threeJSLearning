import ViewWithPhysics from './scene/viewWithPhysics';
import ViewReward from './scene/viewReward';
import View from './scene/view';

import ViewLession1_1 from './scene/lession1/viewLession1_1';
import ViewLession1_1_ans from './scene/lession1/viewLession1_1_ans';
import ViewLession1_2 from './scene/lession1/viewLession1_2';
import ViewLession1_2_ans from './scene/lession1/viewLession1_2_ans';

import ViewLession2_PerspectiveCamera from './scene/lession2/ViewLession2_PerspectiveCamera';
import ViewLession2_OrthographicCamera from './scene/lession2/ViewLession2_OrthographicCamera';
import ViewLession2_Scene from './scene/lession2/ViewLession2_Scene';
import ViewLession2_Renderer from './scene/lession2/ViewLession2_Renderer';
import ViewLession2_Mesh from './scene/lession2/ViewLession2_Mesh';

import ViewLession3_1 from './scene/lession3/ViewLession3_1';

if (module.hot) {
    module.hot.accept();
}

// new ViewReward();
// new ViewWithPhysics();
// new View();

// new ViewLession1_1();
// new ViewLession1_1_ans();
// new ViewLession1_2();
// new ViewLession1_2_ans();

// new ViewLession2_PerspectiveCamera(); // 透視相機
// new ViewLession2_OrthographicCamera(); // 正交相機
// new ViewLession2_Scene(); // 場景
// new ViewLession2_Renderer(); // 渲染器
// new ViewLession2_Mesh(); // 物件、材質、形狀

new ViewLession3_1(); // shader