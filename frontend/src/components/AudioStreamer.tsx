import React, { useState, useRef } from 'react';
// import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { Auth } from 'aws-amplify';
import ReactPlayer from 'react-player';
import './AudioStreamer.css'; // Make sure to create a corresponding CSS file

interface AudioStreamerProps {
  objectKey: string;
}

// const REGION = import.meta.env.VITE_APP_REGION;
// const identityPoolId = import.meta.env.VITE_APP_USER_POOL_ID;
const AUDIO_FILE_BUCKET = "bedrockchatstack-largemessagebucketad0c9b6b-mdwzslwfpwzq";


const AudioStreamer: React.FC<AudioStreamerProps> = ({ objectKey }) => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [playing, setPlaying] = useState<boolean>(false);
  const playerRef = useRef<ReactPlayer>(null);
  // const bucketName = AUDIO_FILE_BUCKET;
  // const region = REGION;
  // // console.log("region: ", region);
  // console.log("bucketName: ", bucketName);


  const fetchAudioUrl = async () => {
    // const currentSession = await Auth.currentSession();
    // console.log("*** currentSession: ", currentSession);
    // const currentUserCredentials = await Auth.currentCredentials();
    // console.log("*** currentUserCredentials: ", currentUserCredentials);
    // const currentAccessKeyId = currentUserCredentials.accessKeyId;
    // const currentSecretAccessKey = currentUserCredentials.secretAccessKey;
    // const currentSessionToken = currentUserCredentials.sessionToken;

    // console.log("*** currentSession: ", currentSession);
    // console.log("*** currentAccessKeyId: ", currentAccessKeyId);
    // console.log("*** currentSecretAccessKey: ", currentAccessKeyId);

    // // const currentSession = await Auth.currentSession();
    // // const idToken = currentSession.getIdToken().getJwtToken();

    // console.log("*** here: ");

    // const s3Client = new S3Client({
    //   region,
    //   credentials: {
    //     accessKeyId: currentAccessKeyId,
    //     secretAccessKey: currentSecretAccessKey,
    //     sessionToken: currentSessionToken,
    //   },
    // });

    // console.log("*** here 2 ", s3Client);

    // objectKey = "conversation2.mp3";
    // const command = new GetObjectCommand({ Bucket: bucketName, Key: objectKey });
    // console.log("*** command: ", command);
    // const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const url = "https://s3.amazonaws.com/"+AUDIO_FILE_BUCKET+"/"+objectKey;
    console.log("*** URL: ", url);
    setAudioUrl(url);
  };


  const togglePlayPause = () => {
    if (!audioUrl) {
      fetchAudioUrl();
    } else {
      setPlaying(!playing);
    }
  };

  return (
    <div className="audio-streamer">
      <div className="audio-player">
        <button className="play-pause-button" onClick={togglePlayPause}>
          {playing ? 'Pause' : 'Play'}
        </button>
        {audioUrl && (
          <ReactPlayer
            ref={playerRef}
            url={audioUrl}
            playing={playing}
            controls={false}
            width="0"
            height="0"
            style={{ display: 'none' }} // Hide the ReactPlayer element
          />
        )}
      </div>
    </div>
  );
};



export default AudioStreamer;
