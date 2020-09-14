
FilePond.registerPlugin(FilePondPluginImagePreview);
FilePond.registerPlugin(FilePondPluginFileValidateType);
const inputElement = document.querySelector('input[type="file"]');
const pond = FilePond.create(inputElement , {
  acceptedFileTypes: ['image/*'],
});
FilePond.setOptions({
  imagePreviewMaxHeight: 50,
  
  server: {
    url: '/uploads',
    load: (src, load) => {
      fetch(src)
        .then(res => res.blob())
        .then(load);
    },
    revert: (src, load) => {
      $.ajax({
        url: "/uploads?action=dltNew",
        type: 'delete',
        data: { 'file': src }
      })
      load();
    },
    remove: (src, load) => {
      $.ajax({
        url: "/uploads?action=dltExist",
        type: 'delete',
        data: { 'file': src }
      })
      load();
    }
  },
  labelButtonAbortItemLoad: "Abort",
  labelButtonAbortItemProcessing: "إلغاء",
  labelButtonProcessItem: "رفع",
  labelButtonRemoveItem: "إزالة",
  labelButtonRetryItemLoad: "إعادة المحاولة",
  labelButtonRetryItemProcessing: "إعادة المحاولة",
  labelButtonUndoItemProcessing: "تراجع",
  labelDecimalSeparator: ".",
  labelFileAdded: "تم الإضافة بنجاح",
  labelFileCountPlural: "الملفات في القائمة",
  labelFileCountSingular: "file in list",
  labelFileLoadError: "خطأ أثناء التهيئة",
  labelFileLoading: "جاري الرفع",
  labelFileProcessing: ".. جاري الرفع",
  labelFileProcessingAborted: "تم إلغاء الرفع",
  labelFileProcessingComplete: "تم الرفع بنجاح",
  labelFileProcessingError: "خطأ في الرفع",
  labelFileProcessingRevertError: "خطأ في التراجع",
  labelFileRemoveError: "Error during remove",
  labelFileRemoved: "تم الإزالة",
  labelFileSizeNotAvailable: "Size not available",
  labelFileWaitingForSize: "Waiting for size",
  labelIdle: "إرفاق صور",
  labelInvalidField: "خطأ في نوع الملفات",
  labelTapToCancel: "إضغط للإلغاء",
  labelTapToRetry: "إضغط للمحاولة أخرى",
  labelTapToUndo: "أضغط للتراجع",
  labelFileTypeNotAllowed	:'مسموح فقط صور',
  fileValidateTypeLabelExpectedTypes	:'Expects {allButLastType} or {lastType}'	
});

/*
pond.on('processfilestart', ()=> {
  console.log('start');
    $("#submitId").attr("disabled", true);
});

pond.on('processfile' , ()=>{
  console.log('end');
  $("#submitId").attr("disabled", false);
})
*/
/*
    const filepond_root = document.querySelector('.filepond--root');
    filepond_root.addEventListener('FilePond:processfilerevert', e => {
      $.ajax({
        url: "{!! route('ajax.revertFiles') !!}",
        type: 'DELETE',
        data: { '_token': '{!! csrf_token() !!}', 'filename':  }
      })
    });
    */
  
