<form method="POST" action="<?= \Controller\Router::url('apply'); ?>" id="apply-form">
    <div class="apply-section">
        <h3><?= _("PERSONNAL INFORMATIONS"); ?></h3>
        <div class="row">
            <div>
                <label for="real_name"><?= _("Real name") ?></label>
                <input type="text" name="real_name" id="real_name" value="" />
            </div>
            <div class="r">
                <label for="country"><?= _("Country") ?></label>
                <input type="text" name="country" id="country" value="<?=(empty($loggedUser)) ? "" :  $loggedUser->getCountry() ?>" />
            </div>
        </div>
        <div class="row">
            <div>
                <label for="languages"><?= _("Languages-s (Comma separated please)") ?></label>
                <input type="text" name="languages" id="languages" value="<?=(empty($loggedUser)) ? "" : $loggedUser->getLanguages() ?>" />
            </div>
            <div class="r">
                <label for="update_freq"><?= _("How often do you plan to edit Skill Project ?") ?></label>
                <select id="update_freq" name="update_freq">
                    <option value="Now and then"><?= _("Now and then"); ?></option>
                    <option value="At least once a month"><?= _("At least once a month"); ?></option>
                    <option value="At least once a week"><?= _("At least once a week"); ?></option>
                    <option value="For now, every day"><?= _("For now, every day"); ?></option>
                    <option value="Any free time i have, it's for Skill Project"><?= _("Any free time i have, it's for Skill Project"); ?></option>
                </select>
            </div>
        </div>
    </div>
    <div class="apply-section">
        <div>
            <label for="interests"><?= _("SKILLS OF INTEREST") ?></label>
            <input type="text" name="interests" id="interests" value="<?=(empty($loggedUser)) ? "" :  $loggedUser->getInterests() ?>" />
        </div>
    </div>
    <div class="apply-section">
        <label for="job-textarea"><?= _("HOW WOULD YOU DESCRIBE YOUR PROFESSIONAL ACTIVITIES ?"); ?></label>
        <textarea name="job" id="job-textarea"></textarea>
    </div>
     <div class="apply-section">
        <label for="motiv-textarea"><?= _("WHY ARE YOU VOLUNTEERING TO BE AN EDITOR OF SKILL PROJECT ?"); ?></label>
        <textarea name="motiv" id="motiv-textarea"></textarea>
    </div>
    <div class="submit-container">
        <input class="pink-submit" type="submit" value="<?= _("APPLY") ?>" />
        <?php
            if (!empty($errors)):
            foreach($errors as $name => $message){
                echo $message . "<br />";
            }
            endif;
        ?>
    </div>
</form>