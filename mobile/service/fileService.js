import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadProfilePic(uri) {
  const response = await fetch(uri); // fetch the file
  const blob = await response.blob(); // convert the file to a blob
  const fileName = `${Date.now()}_${uri.split('/').pop()}`; // generate a unique file name
  const storageRef = ref(storage, `profile_pics/${fileName}`); // create a storage reference in the folder 'profile_pics'

  await uploadBytes(storageRef, blob); // upload the file to the storage reference
  const downloadURL = await getDownloadURL(storageRef); // get the download URL of the uploaded file

  return downloadURL;
}

//i didnt feel like updating the references to the uploadProfilePic function, so I just made a new one
export async function uploadTrailPic(uri) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const fileName = `${Date.now()}_${uri.split('/').pop()}`;

  //the folder being set to 'trail_pics' is the only between the two function
  // it was slightly easier to just duplicate the function. hate me if you want
  const storageRef = ref(storage, `trail_pics/${fileName}`); 

  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}