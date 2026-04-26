{ pkgs, ... }:
{
  name = "storm-software/powerlines";

  dotenv.enable = true;
  dotenv.filename = [
    ".env"
    ".env.local"
  ];
  dotenv.disableHint = true;
}
