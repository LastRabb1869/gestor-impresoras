// assets/js/users/profile-api.js

export async function setProfile(formData) {
  const res = await fetch('set_info/update_profile.php', { method: 'POST', body: formData });
  return res.json();
}