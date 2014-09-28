<?php include("../View/inc/profile_common.php"); ?>
        <div id="right-column">
            <div class="profile-section">
                <h3><?= _("BIO"); ?></h3>
                <?php if (!empty($profileUser->getBio())): ?>
                <p><?= \Utils\SecurityHelper::encode($profileUser->getBio()); ?></p>
                <?php else: ?>
                <p><?= _("No bio !"); ?></p>
                <?php endif; ?>
            </div>
            <div class="profile-section">
                <h3><?= _("PERSONNAL INFORMATIONS"); ?></h3>
                <span class="pale-label">Country:</span> <?php echo ($profileUser->getCountry()) ? ($profileUser->getCountry()) : _("not set !"); ?><br />
                <span class="pale-label">Languages:</span> <?php echo ($profileUser->getLanguages()) ? ($profileUser->getLanguages()) : _("not set !"); ?><br />
                <span class="pale-label">Interests:</span> <?php echo ($profileUser->getInterests()) ? ($profileUser->getInterests()) : _("not set !"); ?><br />

            </div>
            <div class="profile-section">
                <h3><?= _("RECENT ACTIVITY"); ?></h3>
                <?php if (!empty($latestActivity)): ?>
                    <?php print_r($latestActivity); ?>
                <?php else: ?>
                    <?= _("No activity yet !"); ?>
                <?php endif; ?>
            </div>
            <?php
            //own profile ?
            $loggedUser = \Utils\SecurityHelper::getUser();
            if ($loggedUser && $profileUser->getUsername() == $loggedUser->getUsername()):
            ?>
            <a href="<?= \Controller\Router::url("profile", array("username" => $loggedUser->getUsername())) ?>" title="<?= _("Edit your profile"); ?>"><?= _("Edit your profile"); ?></a>
            <?php endif; ?>
        </div>
    </div>
</section>