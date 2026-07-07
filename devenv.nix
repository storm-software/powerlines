{ pkgs, inputs, ... }:
{
  name = "storm-software/powerlines";

  dotenv = {
    enable = true;
    filename = [
      ".env"
      ".env.local"
    ];
    disableHint = true;
  };

  packages = with pkgs; [
    capnproto
  ];

  profiles = {
    development.module = {
      env.ENVIRONMENT = "development";
      env.NODE_ENV = "development";
      env.DEBUG = true;

      languages = {
        nix = {
          enable = true;
        };
      };

      tasks = {
        "storm:setup:git" = {
          exec = ''
            git config commit.gpgsign true
            git config tag.gpgSign true
            git config lfs.allowincompletepush true
            git config init.defaultBranch main

            npm config set provenance true
          '';
          before = [
            "devenv:enterShell"
            "devenv:enterTest"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
          ];
        };
        "storm:setup:install" = {
          exec = ''
            pnpm exec storm-git pre-install
            pnpm install --no-frozen-lockfile
            update-storm
            bootstrap

            pnpm exec storm-git prepare
          '';
          before = [
            "devenv:enterShell"
            "devenv:enterTest"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
            "storm:setup:git"
          ];
        };
      };
    };

    production.module = {
      env.ENVIRONMENT = "production";
      env.NODE_ENV = "production";
      env.DEBUG = false;
      env.DEVENV_TUI = false;

      tasks = {
        "storm:setup:git" = {
          exec = ''
            git config commit.gpgsign true
            git config tag.gpgSign true
            git config lfs.allowincompletepush true
            git config init.defaultBranch main

            npm config set provenance true
          '';
          before = [
            "devenv:enterShell"
            "devenv:enterTest"
            "storm:setup:install"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
          ];
        };
        "storm:setup:install" = {
          exec = ''
            pnpm install --frozen-lockfile
            bootstrap
          '';
          before = [
            "devenv:enterShell"
            "devenv:enterTest"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
            "storm:setup:git"
          ];
        };
      };
    };
  };
}
