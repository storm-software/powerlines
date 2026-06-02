{ pkgs, ... }:
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
}
