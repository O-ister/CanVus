// ********** 전역변수 셋 ********** //
// 전체 레이어 객체 및 z-index를 저장하는 리스트
const layerSet = []; // 예: p3l2의 패브릭 객체는 layerSet[2][1]
const zNumSet = []; // 예: p1l1이 z-index가 3이라면 zNumSet[0][0]  == 3
const eventSet = [];

// 현재 바라보고 있는 페이지 번호와 레이어번호
let pageNum = 1;
let layerNum = 1;

// 전 단계에서 바라보고 있던 페이지번호와 레이어번호
let bPageNum = 0;
let bLayerNum = 0;
// ********** fabric 관련 함수 ********** //
function createLayer() {
    const totalNumOfLayer = layerSet[pageNum-1].length;
    let layerId = 'p' + pageNum + 'l' + (totalNumOfLayer+1);

    // 이부분에 canvas 태그를 생성하는 구문을 넣어줄 것 아이디는 layerId로 준다.
    let contents = `<canvas id="${layerId}"></canvas>`;
    $(`#p${pageNum}`).append(contents);

    ///////////////////////////////////////////////////////////////
    // TODO fabric 객체를 만들고 객체배열에 추가하는 프로세스
    let newLayer = new fabric.Canvas(layerId);
    newLayer.isDrawingMode = true;
    layerSet[pageNum-1].push(newLayer);
    console.log(layerSet);

    //TODO 부가적으로 생성된 canvas-container를 지우는 프로세스
    $('.canvas-container').attr('class', 'remove');
    $('.upper-canvas').attr('class', layerId+'u');
    $('#'+layerId).appendTo('#p'+pageNum);
    $('.'+layerId+'u').appendTo('#p'+pageNum);
    $('.remove').remove();

    // TODO z-index CSS 속성을 부여하고 Z-INDEX 배열에 추가하는 프로세스
    $('#'+layerId).css({'z-index':totalNumOfLayer+1});
    $('.'+layerId+'u').css({'z-index':totalNumOfLayer+1});
}

function initializeCreateLayer(pageNo) {
    const totalNumOfLayer = layerSet[pageNo-1].length;
    let layerId = 'p' + pageNo + 'l' + (totalNumOfLayer+1);

    // 이부분에 canvas 태그를 생성하는 구문을 넣어줄 것 아이디는 layerId로 준다.
    let contents = `<canvas id="${layerId}"></canvas>`;
    $(`#p${pageNo}`).append(contents);

    ///////////////////////////////////////////////////////////////
    // TODO fabric 객체를 만들고 객체배열에 추가하는 프로세스
    let newLayer = new fabric.Canvas(layerId);
    newLayer.isDrawingMode = true;
    layerSet[pageNo-1].push(newLayer);
    console.log(layerSet);

    // TODO 이벤트객체를 이벤트배열에 추가하는 프로세스.
    const eventObj = newLayer.on('mouse:up', function() {
        const message = {
            page_no: pageNo,
            layer_no : totalNumOfLayer+1,
            stringify: JSON.stringify(newLayer)
        };
        sendMessage(message, "drawing"); // 예: 2번 페이지는 1번 인덱스이다.
    });
    eventSet[pageNo-1].push(eventObj);
    console.log(eventSet);

    //TODO 부가적으로 생성된 canvas-container를 지우는 프로세스
    $('.canvas-container').attr('class', 'remove');
    $('.upper-canvas').attr('class', layerId+'u');
    $('#'+layerId).appendTo('#p'+pageNo);
    $('.'+layerId+'u').appendTo('#p'+pageNo);
    $('.remove').remove();

    // TODO z-index CSS 속성을 부여하고 Z-INDEX 배열에 추가하는 프로세스
    $('#'+layerId).css({'z-index':totalNumOfLayer+1});
    $('.'+layerId+'u').css({'z-index':totalNumOfLayer+1});
    zNumSet[pageNo-1].push(totalNumOfLayer+1);
    console.log(zNumSet);
}

function createPage() {
    const totalNumOfPage = layerSet.length;
    const pageId = 'p' + (totalNumOfPage+1); // 예: length가 1이면 2번 페이지를 만들어야한다

    // 이 부분에 canvas 태그 생성구문을 넣을 것. 아이디는 p만든레이어번호l1로 준다.
    // 첫 레이어는 자동생성을 하는 편이 좋을 듯 싶다.
    let contents = `<canvas id="${pageId}l1"></canvas>`;
    $('#base').append(contents);

    ///////////////////////////////////////////////////////////////

    // TODO 객체 배열 및 z-index배열을 만드는 프로세스
    layerSet.push([]);
    zNumSet.push([]);
    eventSet.push([]);

    // TODO 해당 페이지의 첫 레이어를 만드는 프로세스
    let newLayer = new fabric.Canvas(pageId + 'l1');
    newLayer.isDrawingMode = true;
    layerSet[totalNumOfPage].push(newLayer); // 예: 2번 페이지는 1번 인덱스이다.
    console.log(layerSet);

    // TODO canvas-container를 단 1개로 유지하기 위해 ID속성부여 프로세스
    $('.canvas-container').attr('id', pageId);
    $('.upper-canvas').attr('class', pageId+'l1u');
    $('#'+pageId).attr('class', 'tabcontent');

    // TODO 생성된 canvas 태그들에 z-index를 부여하고 zNumSet에 반영하는 프로세스
    $('#'+pageId+'l1').css({"z-index": 1});
    $('.'+pageId+'l1u').css({"z-index": 1});
    zNumSet[totalNumOfPage].push(1);
    console.log(zNumSet);

    // TODO 이벤트 객체를 eventSet에 넣는 프로세스
    const eventObj = newLayer.on('mouse:up', function() {
        const message = {
            page_no: totalNumOfPage+1,
            layer_no : 1,
            stringify: JSON.stringify(newLayer)
        };
        sendMessage(message, "drawing"); // 예: 2번 페이지는 1번 인덱스이다.
    });
    eventSet[totalNumOfPage].push(eventObj);
    console.log(eventSet);

    // 소켓에 페이지를 만들었다는 정보를 쏴주는 구문 (이니셜라이즈 문제가 있어 isInitialized 도입)
    if (isInitialized) {
        const message = {
            page_no: totalNumOfPage+1,
            layer_no: 1
        };

        sendMessage(message,'CREATEPAGELAYER');
    }
    ///////////////////////////////////////////////////////////////
}

function deleteLayer(layerId) {
    let temp = layerId.split("p");
    temp = temp[1].split("l");
    let pageNumber = parseInt(temp[0]);
    let layerNumber = parseInt(temp[1]);

    $('#'+layerId).remove();
    $('.'+layerId+'u').remove();

    layerSet[pageNumber-1][layerNumber-1] = null;
    zNumSet[pageNumber-1][layerNumber-1] = null;
    eventSet[pageNumber-1][layerNumber-1] = null;

    // 소켓에 레이어를 지웠다고 전송하는 구문 (추후작성예정)
    const message = {
        page_no: pageNumber,
        layer_no: layerNumber
    };
    sendMessage(message,'DELETEPAGELAYER');
}

function deletePage() {
    const layerLength = layerSet[pageNum-1].length;

    $('#p'+pageNum).remove();

    layerSet[pageNum-1] = [];
    zNumSet[pageNum-1] = [];
    eventSet[pageNum-1] = [];

    // 소켓에 페이지를 지웠다고 전송하는 구문 (추후작성예정)
}

function createBox(layerId) {
    let contents
        = `<div class='itemBox' id="${layerId}b" style="width:200px; height:60px; background-color:white;" >`
        + "<div style='float:left;'>"
        + "<span class='itemNum'></span> "
        + `<span name="item">Layer : ${layerId.split("l")[1]}</span>`
        // + `<input type='text' name='item' value="${layerId}" readonly="readonly" style='width:300px;'/>`
        + "</div>"
        + "</div>";
    return contents;
}



function reorder() {
    $(".itemBox").each(function (i, box) {
        $(box).find(".itemNum").html(i + 1);

        let itemBoxIdArray = [];
        $(".itemBox").each(function(){
            let temp = $(this).attr("id");
            temp = temp.split('b');
            itemBoxIdArray.push(temp[0]);

            // z index reodering
            for (let i=0; i<itemBoxIdArray.length; i++) {
                let temp2 = itemBoxIdArray[i].split('p');
                temp2 = temp2[1].split('l');
                zNumSet[temp2[0]-1][temp2[1]-1] = i+1;
                $('#'+itemBoxIdArray[i]).css({'z-index': i+1});
                $('.'+itemBoxIdArray[i]+'u').css({'z-index': i+1});
            }
        });
    });
}
// ******************** 레이어 리스트 관련 함수 ********************//
function createItem(layerId) {
    $(createBox(layerId))
        .appendTo("#itemBoxWrap")
        .hover(
            function () {
                $(this).css('backgroundColor', 'skyblue');
                $(this).find('.deleteBox').show();
            },
            function () {
                $(this).css('background', 'white');
                $(this).find('.deleteBox').hide();
            }
        )
        .append("<div class='deleteBox'>[삭제]</div>")
        .find(".deleteBox").click(function () {
        let delCheck = confirm('해당 레이어를 지우시겠습니까?');

        if (delCheck) {
            console.log(layerId);
            // 실질적 레이어를 삭제한다.
            deleteLayer(layerId);

            $(this).parent().remove();
            reorder();
        }
    })
        .click(function(){
            $('#'+layerId+'b').css('backgroundColor', 'red');
        });
    // 숫자를 다시 붙인다.
    reorder();
}


/*********************** 이벤트 등록파트 *******************/
$(()=>{
    // ************ 레이어 리스트 초기설정 *****************//
    $("#itemBoxWrap").sortable({
        placeholder: "itemBoxHighlight",
        start: function (event, ui) {
            ui.item.data('start_pos', ui.item.index());
        },
        stop: function (event, ui) {
            var spos = ui.item.data('start_pos');
            var epos = ui.item.index();
            reorder();
        }
    });
    // ********** 레이어 이니셜라이저 실행  ***************//
    initializer();

    // ******************** Page Layer Initializer ******************** //
    function initializer() {
        const data = {
            room_Id : room_Id
        };
        let layers = null;

        $.ajax({
            url : "/drawing/getAllLayers",
            type : "POST",
            dataType : "json",
            async : false,
            contentType : "application/json",
            data : JSON.stringify(data),
            success : function(result) {
                layers = result;
            },
            error:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });

        let i = 2;
        for (let layer of layers) {
            const page_no = layer['page_no'];
            const layer_no = layer['layer_no'];
            const obj = layer['stringify'];

            if (page_no == i || (page_no == 1 && layer_no == 1)) {
                // 크리에이트 탭 버튼을 누르는 효과를 주는 구문
                const totalPage = layerSet.length;

                createPage();

                let content = `<div id="p${totalPage+1}"></div>`;
                $('#p'+(totalPage+1)).appendTo('#base');

                content = `<li data-tab="p${totalPage+1}"><a href="#">p${totalPage+1}</a></li>`

                $('.tab').append(content);
                /////////////////////////////////////////////////////
                let targetObj = layerSet[page_no-1][layer_no-1];
                targetObj.loadFromJSON(obj, targetObj.renderAll.bind(targetObj));

                if (page_no != 1){
                    i++;
                }
            } else {
                initializeCreateLayer(page_no);
                let targetObj = layerSet[page_no-1][layer_no-1];
                targetObj.loadFromJSON(obj, targetObj.renderAll.bind(targetObj));
            }
        } // FOR END

        isInitialized = true;
    }

    // Layer Explorer를 클릭시 현재 페이지번호, 레이어번호를 업데이트하고 현재 바라보는 레이어를 설정.
    $(document).on('click', '#itemBoxWrap' ,function(event) {
        console.log("레이어 타게팅 체인지 함수");
        let layerBoxId = event.target.id;
        // 전 단계 페이지 레이어 번호 지정 및 z인덱스
        bPageNum = pageNum;
        bLayerNum = layerNum;
        const bPageLayer = "p" + bPageNum + "l" + bLayerNum;
        // 전 단계 upper-canvas의 z-index를 원상복구한다.
        $('#'+bPageLayer+'u').css({"z-index": zNumSet[bPageNum-1][bLayerNum-1]});

        // 현 단계 페이지 번호 지정
        layerBoxId = layerBoxId.split('b')[0];
        layerBoxId = layerBoxId.split('p');
        layerBoxId = layerBoxId[1].split('l');
        pageNum = parseInt(layerBoxId[0]);
        layerNum = parseInt(layerBoxId[1]);
        console.log(pageNum);
        console.log(layerNum);
        const pageLayer = "p"+pageNum+"l"+layerNum;

        // 레이어 타게팅
        currlayer = layerSet[pageNum-1][layerNum-1];
        changeBrush();
        // 타게팅한 레이어를 그릴수 있는 upper-canvas를 가장 위에둔다.
        $('.'+pageLayer+"u").css({"z-index": 10000});
    });

    // ************ 페이지텝 이벤트 *********/
    $(document).on('click', 'ul.tab li', function() {
        let activeTab = $(this).attr('data-tab');
        $('ul.tab li').removeClass('current');
        $('.tabcontent').removeClass('current');
        $(this).addClass('current');
        $('#'+activeTab).addClass('current');

        // 레이어 리스트 박스를 초기화한다.
        $('#itemBoxWrap').empty();

        // 클릭한 레이어 번호를 현재 레이어 번호로 가진다.
        if (activeTab != "create") {
            bPageNum = pageNum; // 그전에 이전 레이어 번호로 넘긴다.
            pageNum = parseInt(activeTab.substr(1, activeTab.length));
            console.log(activeTab.substr(1, activeTab.length));

            // 레이어 리오더링
            let numOfLayer = layerSet[pageNum-1].length;
            for (let j=1; j<=numOfLayer; j++){
                for (let k=0; k<numOfLayer; k++) {
                    if(zNumSet[pageNum-1][k] == j) {
                        if (layerSet[pageNum-1][k] !=null) {
                            const layerId = "p"+pageNum+"l"+(k+1);
                            createItem(layerId);
                        }
                        break;
                    }
                }
            }
        }
    });

    //************* 페이지 생성 이벤트 ******************//
    $('#createPage').click(function() {
        const totalPage = layerSet.length;

        createPage();

        let content = `<div id="p${totalPage+1}"></div>`;
        $('#p'+(totalPage+1)).appendTo('#base');

        content = `<li data-tab="p${totalPage+1}"><a href="#">p${totalPage+1}</a></li>`

        $('.tab').append(content);
    });

    // ******************* 레인지바 초기설정함수 *****************//
    (function initAndSetupTheSliders() {
        var inputs = [].slice.call(document.querySelectorAll('.range-slider input'));
        inputs.forEach(function (input) {
            return input.setAttribute('value', '10');
        });
        inputs.forEach(function (input) {
            return sliderObj.updateSlider(input);
        });
        // Cross-browser support where value changes instantly as you drag the handle, therefore two event types.
        inputs.forEach(function (input) {
            return input.addEventListener('input', function (element) {
                return sliderObj.updateSlider(input);
            });
        });
        inputs.forEach(function (input) {
            return input.addEventListener('change', function (element) {
                return sliderObj.updateSlider(input);
            });
        });
    })();

    //******************* 색, 굵기, 투명도 변경과 관련된 이벤트 ********//
    $(document).on('mouseup', '.range-container', function(){
        console.log("레인지바 이벤트 작동");

        const MAX_THICKNESS = 20;
        const MAX_OPACITY = 1;

        let thickness = $('#thicknessBar').text();
        thickness = parseInt(thickness.split('%')[0]);
        thickness = MAX_THICKNESS * (thickness/100);
        let opacity = $('#opacityBar').text();
        opacity = parseInt(opacity.split('%')[0]);
        opacity = MAX_OPACITY * (opacity/100);

        console.log(thickness);
        console.log(opacity);

        thicknessGlobal = thickness;
        opacityGlobal = opacity;

        changeBrush();
    });
});
