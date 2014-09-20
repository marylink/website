<form method="POST" action="<?php echo \Controller\Router::url("forgotPassword1"); ?>">
    <div>
        <label for="loginUsername"><?php echo _("USERNAME OR EMAIL") ?></label>
        <input type="text" name="loginUsername" id="loginUsername" />
    </div>
    <div class="submit-container">
        <input type="submit" value="<?php echo _("SEND RECOVERY MESSAGE") ?>" />
    </div>
    <?php
        if (!empty($error['global'])){
            echo $error['global'];
        }
    ?>
</form>
<p><?= _("You don't have an account yet ?"); ?> <a href="<?= \Controller\Router::url("register"); ?>" class="register-link" title="<?= _("Sign up !"); ?>"><?= _("You can create one !"); ?></a></p>