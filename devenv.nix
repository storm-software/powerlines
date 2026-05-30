{ ... }:
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
}
