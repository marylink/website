<form method="POST" action="<?= \Controller\Router::url("register"); ?>">
    <div>
        <label for="username"><?= _("USERNAME") ?></label>
        <input type="text" name="username" id="username" />
    </div>
    <div>
        <label for="email"><?= _("EMAIL") ?> <?= _("We do not spam."); ?></label>
        <input type="email" name="email" id="email" />
    </div>
    <div>
        <label for="password"><?= _("PASSWORD") ?></label>
        <input type="password" name="password" id="password" />
    </div>
    <div>
        <label for="password_bis"><?= _("PASSWORD AGAIN") ?></label>
        <input type="password" name="password_bis" id="password_bis" />
    </div>
    <div class="submit-container">
        <input type="submit" value="<?= _("SIGN UP") ?>" />
    </div>
    <?php
        foreach($errors as $name => $message){
            echo $message . "<br />";
        }
    ?>
</form>
<p><?= _("Already have an account ?"); ?> <a href="<?= \Controller\Router::url("login"); ?>" class="login-link" title="<?= _("Sign in !"); ?>"><?= _("Sign in !"); ?></a></p>