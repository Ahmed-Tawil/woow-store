

let data = []
let productKindRecived = null

let selectizeProductClassObj = null
let selectizeProductKindObj = null

let images = []
$(document).ready(function () {
    $.get('/products/getJson', function (recivedData, status) {
        productKindRecived = recivedData 
    })

    if (action == 'edit') {
        let url = window.location.href.split('?')[0] + '?action=getOrderData'
        $.get(url, function (recivedData, status) {
            data = [...recivedData.orderCase]
            images = recivedData.images.map(img => {
                return {
                    source: `/uploads/${recivedData._id}/${img}`,
                    options: {
                        type: 'local'
                    }
                }
            })
            //console.log(pond);
            pond.setOptions({
                files: images,
                instantUpload: true
            })
            displayTable(orderTable, data)
            finalTotal()
            //let imagesArr = recivedData.images.map(img => `/uploads/orderImages/${recivedData._id}/${img}`)
            //imagesArr.push('')
            //myUpload.addImagesFromPath(imagesArr)
        })
    }


    let productClass = $('#productClass').selectize({
        onDropdownOpen: function () {
            this.clear();
            this.focus()
        }


    })
    let productKind = $('#productKind').selectize({

    })

    let selectizeProductClass = productClass[0].selectize;
    let selectizeProductKind = productKind[0].selectize;
    selectizeProductClassObj = selectizeProductClass;
    selectizeProductKindObj = selectizeProductKind;


    selectizeProductKindObj.on('focus', function (value, isOnInitialize) {
        selectizeProductKind.clearOptions()
        const selectedVal = $('#productClass[class*="selectize"] option').val()
        productKindRecived.filter(Items => Items.productClass == selectedVal).map(item => {
            selectizeProductKindObj.addOption({ value: item._id, text: item.productName });
        })
    })


    selectizeProductClass.on('change', function (value, isOnInitialize) {
        selectizeProductKindObj.clearOptions()
        selectizeProductKindObj.clear()
    })
    selectizeProductClass.on('focus', function (value, isOnInitialize) {
        selectizeProductKindObj.clearOptions()
        selectizeProductKindObj.clear()

    })


    //var $select = $('#productClass').selectize();
    //var selectize = $select[0].selectize;
});


/*

$("#productClass").change(() => {
    $("#productKind").html('')
    const selectedVal = $("#productClass option:selected").val()
    productKindRecived.filter(Items => Items.productClass == selectedVal).map(item => {
        $("#productKind").append(`<option value="${item._id}" price="${item.productPrice}">${item.productName}</option>`);
    })
});

*/

addDetailbtn.addEventListener('click', () => {
    let obj = {
        productClass: {
            id: '',
            title: ''
        },
        productKind: {
            id: '',
            title: ''
        },
        orderDetails: '',
        orderPrepar: {
            id: '',
            name: ''
        },
        orderHelper: {
            id: '',
            name: ''
        },
        price: ''
    }

    obj.productClass.id = $('#productClass[class*="selectize"] option').val()
    obj.productClass.title = selectizeProductClassObj.getItem(selectizeProductClassObj.getValue()).text();
    obj.productKind.id = $('#productKind[class*="selectize"] option').val()
    obj.productKind.title = selectizeProductKindObj.getItem(selectizeProductKindObj.getValue()).text();
    obj.orderDetails = $("#orderDetails").val()
    obj.orderPrepar.id = $("#prepareId option:selected").val()
    obj.orderPrepar.name = $("#prepareId option:selected").text()
    obj.orderHelper.id = $("#helperId option:selected").val()
    obj.orderHelper.name = $("#helperId option:selected").text()
    if (!(obj.productClass.id && obj.productKind.id && obj.orderPrepar.id)) {
        alert('alert' , 'تحقق من أن جميع الحقول ممتلئة!')
        location.href = '#mainTitile'

        return
    }
    obj.price = productKindRecived.filter(item => item._id == obj.productKind.id)[0].productPrice
    
    data.push(obj)
    displayTable(orderTable, data)
    $("#orderDetails").val('')
    finalTotal()

    location.href = '#orderTable'
})
let gIndex = 0
let showUpdateTable = (e) => {
    const index = e.id
    gIndex = index
    $('#modelLabel').text(`تعديل طلب رقم ${parseInt(index) + 1}`)
    $('#UpdateOrderDetails').val(data[index].orderDetails)
    $(`#UpdatePrepareId option[value=${data[index].orderPrepar.id}]`).attr('selected', 'selected');
    $(`#UpdateHelperId option[value=${data[index].orderHelper.id}]`).attr("selected", "selected");
    $('#editModal').modal('toggle')
}
$('#updateTableBtn').on('click', () => {
    data[gIndex].orderDetails = $('#UpdateOrderDetails').val()
    data[gIndex].orderPrepar.id = $("#UpdatePrepareId option:selected").val()
    data[gIndex].orderPrepar.name = $("#UpdatePrepareId option:selected").text()
    data[gIndex].orderHelper.id = $("#UpdateHelperId option:selected").val()
    data[gIndex].orderHelper.name = $("#UpdateHelperId option:selected").text()
    $('#editModal').modal('toggle');
    displayTable(orderTable, data)
    finalTotal()
})



const alert = (elementId, text) => {
    $(`#${elementId}`).html(`<div class="alert alert-warning alert-dismissible fade show" role="alert" > 
    <strong style="padding: 0 25px  0 5px ;"> خطأ!</strong>${text}  
    <button type="button" class="close" data-dismiss="alert" aria-label="Close"  >
    <span aria-hidden="true">&times;</span>
    </button>
    </div>`)
}
$('#form1').on('submit', function () {
    //const imgsName = myUpload.cachedFileArray.map(img => img.name)
    $('#hidden_input').val(JSON.stringify(data));
});

const btnClick = () => {
    if (data == false) {
        alert('alert' , 'تحقق من أن جميع الحقول ممتلئة!')
        location.href = '#mainTitile'
        return false
    }
    return true
}

const displayTable = (orderTable, data) => {
    let temp = ''


    data.map((product, index) => {
        temp = temp + `
        <tr style="margin:5px">
        <td  >طلب ${index + 1}</td>
        <td>${product.productClass.title}</td>
        <td>${product.productKind.title}</td>
        <td>${product.price}</td>
        <td>${product.orderPrepar.name}</td>
        <td>${product.orderHelper.name}</td>

        <td class="deleteBtn">
        <a  style="margin:5px" id="${index}" role="button"  role="button" onclick="showUpdateTable(this)">
        <i class="fas fa-pen"></i>
         </a>

        <a  style="margin:5px" role="button" id="${index}" onclick="deleteTableRow(this)">
            <i class="fas fa-minus-circle "></i>
        </a>


        </td>
        </tr>
        
        `
    })

    orderTable.innerHTML = `
    <table class="table table-striped table-hover table-responsive-md table-responsive-sm text-center m-0 table-bordered" style='width:100%'>
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">الصنف</th>
                <th scope="col">النوع</th>
                <th scope="col">السعر</th>
                <th scope="col">تجهيز</th>
                <th scope="col">مساعد</th>
                <th scope="col">أدوات</th>
            </tr>
        </thead>
        <tbody class="text-center">
          ${temp}

          <tr style="border-top: black 2px solid;background-color: #f2f2f2;">
          <td colspan="7" >
            <label id="totalLabel"></label>
          </td>
          </tr>

        </tbody>
    </table>
    <hr class="m-3">
    <style>
        td{
            padding:5px !important;
        }
        th{
            padding:6px !important;
        }
    </style>`

}

const deleteTableRow = (e) => {

    data.splice(parseInt(e.id), 1)
    displayTable(orderTable, data)
    if (data == false)
        orderTable.innerHTML = ''
    finalTotal()

}

const finalTotal = () => {
    let total = 0;
    data.map((item) => {
        total = total + parseInt(item.price)
    })
    const discount = parseInt($("#discount").val()) || 0

    const deliveryPrice = parseInt($('#deliveryCompany option:selected').attr('delivryprice'))
    $('#totalLabel').text(`المجموع الكلي : ${total - discount + deliveryPrice} شيكل`)

}

$("#deliveryCompany").change(() => {
    finalTotal()
});

$("#discount").keyup(() => {
    finalTotal()
});

$("#discount").change(() => {
    finalTotal()
});

