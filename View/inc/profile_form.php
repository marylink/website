<form method="POST" action="<?= \Controller\Router::url('profile', array('username' => $loggedUser->getUsername())); ?>" enctype="multipart/form-data">
    <div class="profile-section">
        <h3><?= _("PERSONNAL INFORMATIONS"); ?></h3>
        <div class="row">
            <div>
                <label for="username"><?= _("Username") ?></label>
                <input type="text" name="username" id="username" value="<?= $loggedUser->getUsername() ?>" />
            </div>
            <div class="r">
                <label for="email"><?= _("Email") ?></label>
                <input type="email" name="email" id="email" value="<?= $loggedUser->getEmail() ?>" />
            </div>
        </div>
        <div class="row">
            <div>
                <label for="languages"><?= _("Languages-s (Comma separated please)") ?></label>
                <input type="text" name="languages" id="languages" value="<?= $loggedUser->getLanguages() ?>" />
            </div>
            <div class="r">
                <label for="country"><?= _("Country") ?></label>
                <input type="text" name="country" id="country" value="<?= $loggedUser->getCountry() ?>" />
            </div>
        </div>
        <div class="row">
            <label for="picture-input"><?= _("Upload a picture of you"); ?></label>
            <input type="file" name="picture" id="picture-input" />
            <p class="hint">Minimum size: 180px x 180px</p>
            <?php 
            if (!empty($uploadErrors)) {
                foreach($uploadErrors as $ue){
                    echo $ue;
                }
            }
            ?>
        </div>
        <div class="row">
            <div>
                <label for="interests"><?= _("CATEGORIES OF INTEREST") ?></label>
                <input type="text" name="interests" id="interests" value="<?= $loggedUser->getInterests() ?>" />
            </div>
        </div>
    </div>
    <div class="profile-section">
        <label for="bio-textarea"><?= _("SAY SOMETHING ABOUT YOURSELF"); ?></label>
        <textarea name="bio" id="bio-textarea"><?= $loggedUser->getBio(); ?></textarea>
    </div>
    <div class="submit-container">
        <input class="pink-submit" type="submit" value="<?= _("SAVE") ?>" />
        <?php
            if (!empty($errors)):
            foreach($errors as $name => $message){
                echo $message . "<br />";
            }
            endif;
        ?>
    </div>
</form>
<br />
<a class="password-link" href="<?= \Controller\Router::url('changePassword'); ?>"><?= _("Change my password"); ?></a>
<?php if (!empty($showPasswordResetForm)): ?>
<script> $(document).ready(function(){ $(".password-link").click(); }); </script>
<?php endif; ?>