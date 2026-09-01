document.querySelectorAll('.card .btn').forEach(function(btn) {
    var originalText = btn.textContent;

    btn.addEventListener('click', function() {
        if (btn.disabled) return;

        btn.dataset.state = 'loading';
        btn.textContent = '⏳ 加载中...';
        btn.disabled = true;

        setTimeout(function() {
            var ok = Math.random() > 0.3;
            if (ok) {
                btn.dataset.state = 'success';
                btn.textContent = '✅ 接单成功';
            } else {
                btn.dataset.state = 'error';
                btn.textContent = '❌ 接单失败';
                setTimeout(function() {
                    btn.dataset.state = 'default';
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 3000);
            }
        }, 1500);
    });
});

var publishBtn = document.querySelector('.publish-panel .btn');
var titleInput = document.querySelector('.publish-panel input');
var detailInput = document.querySelector('.publish-panel textarea');

if (publishBtn) {
    publishBtn.addEventListener('click', function() {
        if (publishBtn.disabled) return;

        publishBtn.dataset.state = 'loading';
        publishBtn.textContent = '⏳ 发布中...';
        publishBtn.disabled = true;

        setTimeout(function() {
            if (titleInput.value.trim() === '' || detailInput.value.trim() === '') {
                publishBtn.dataset.state = 'error';
                publishBtn.textContent = '❌ 标题或详情不能为空';
            } else {
                publishBtn.dataset.state = 'success';
                publishBtn.textContent = '✅ 发布成功';
            }
            setTimeout(function() {
                publishBtn.dataset.state = 'default';
                publishBtn.textContent = '发布';
                publishBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}
