function notifyGood(message) {
    var notification = document.createElement('div');
    notification.className = 'notification-ramm good-ramm';

    var bar = document.createElement('div');
    bar.className = 'bar-ramm';
    notification.appendChild(bar);

    var image = document.createElement('div');
    image.onclick = function() {
      notification.remove();
    };
    image.className = 'image-ramm';
    notification.appendChild(image);

    var content = document.createElement('div');
    content.className = 'content-ramm';
    content.innerHTML = '<label class="me-ramm">' + message + '</label>';
    notification.appendChild(content);

    var progressDiv = document.createElement('div');
    progressDiv.className = 'progressDiv-ramm';
    var progress = document.createElement('div');
    progressDiv.appendChild(progress);
    notification.appendChild(progressDiv);

    document.getElementById('notifications-ramm').appendChild(notification);

    var progressPos = 0;
    var progressIncrement = 100 / 500;

    function startWait() {
      if (progressPos >= 100) {
        fadeInterval = 1;
        fadeTick();
        return;
      }
      setTimeout(tick, 2);
    }

    function tick() {
      progressPos += progressIncrement;
      progress.style.width = progressPos + '%';
      startWait();
    }

    function fadeTick() {
      opacity = ((opacity * 100) - fadeInterval) / 100;
      if (opacity <= 0) {
        notification.remove();
        return;
      }
      notification.style.opacity = opacity;
      setTimeout(fadeTick, 20);
    }

    var fadeInterval = 0;
    var opacity = 1;

    startWait();
  }

  function notifyError(message) {
    var notification = document.createElement('div');
    notification.className = 'notification-ramm error-ramm';

    var bar = document.createElement('div');
    bar.className = 'bar-ramm';
    notification.appendChild(bar);

    var image = document.createElement('div');
    image.onclick = function() {
      notification.remove();
    };
    image.className = 'image-ramm';
    notification.appendChild(image);

    var content = document.createElement('div');
    content.className = 'content-ramm';
    content.innerHTML = '<label class="me-ramm">' + message + '</label>';
    notification.appendChild(content);

    var progressDiv = document.createElement('div');
    progressDiv.className = 'progressDiv-ramm';
    var progress = document.createElement('div');
    progressDiv.appendChild(progress);
    notification.appendChild(progressDiv);

    document.getElementById('notifications-ramm').appendChild(notification);

    var progressPos = 0;
    var progressIncrement = 100 / 500;

    function startWait() {
      if (progressPos >= 100) {
        fadeInterval = 1;
        fadeTick();
        return;
      }
      setTimeout(tick, 2);
    }

    function tick() {
      progressPos += progressIncrement;
      progress.style.width = progressPos + '%';
      startWait();
    }

    function fadeTick() {
      opacity = ((opacity * 100) - fadeInterval) / 100;
      if (opacity <= 0) {
        notification.remove();
        return;
      }
      notification.style.opacity = opacity;
      setTimeout(fadeTick, 20);
    }

    var fadeInterval = 0;
    var opacity = 1;

    startWait();
  }

//   const button = document.getElementById('btn-ramm');
//   button.addEventListener('click', () => {
//     notifyGood("A successful message has been passed");
//   });

//   const errorButton = document.getElementById('errorBtn-ramm');
//   errorButton.addEventListener('click', () => {
//     notifyError("An error has occurred");
//   });