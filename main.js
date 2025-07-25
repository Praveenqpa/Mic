const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
let localTracks = [];

async function startCall() {
  const appId = "8b8a4cda5a3e43c8ad71751ae8b42558"; // Your App ID
  const channel = document.getElementById("channel").value;
  if (!channel) return alert("Enter channel name");

  await client.join(appId, channel, null, null);

  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
  localTracks[1].play("local-video");

  await client.publish(localTracks);

  client.on("user-published", async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
      user.videoTrack.play("remote-video");
    }
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  });
}
