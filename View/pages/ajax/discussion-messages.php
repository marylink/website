
    <?php foreach($messages as $message): ?>
    <div class="message">
        <?= _("By "); ?><a href="#"><?= $message['postedBy']; ?></a><br />
        <?= $message['date']; ?><br /><br />
        <?php if (!empty($message['topic'])){ echo "Topic: " . $message['topic'] . "<br /><br />"; } ?>
        <?php
            $message = $message['message'];
            echo $message; 
        ?>
    </div>
    <?php endforeach; ?>
