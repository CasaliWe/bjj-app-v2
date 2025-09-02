### Doc para a rota /perfil (arquivo UserProfile.jsx):
- os components ficam em components/perfil;
- está sendo passado para os components via props o profileData e o setProfileData (o data user global);
- componente Informacoes.jsx = apenas 2 funcs para lidar (handleProfileSubmit, handleImageUpload);
- componente AlterarSenha.jsx = apenas 1 func para lidar (handlePasswordSubmit);
- componente Configuracoes.jsx = apenas 1 func para lidar (handleUpdateProfileVisibility);
- pode controlar a tab ativa passando ?tab=configuracoes | senha | informacoes;
