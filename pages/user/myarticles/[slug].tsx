import { ChangeEvent, useEffect, useState, DragEvent, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { Backdrop, Box, Button, capitalize, Card, Chip, CircularProgress, Divider, FormControl, Grid, InputLabel, List, MenuItem, Select, TextField, Typography } from '@mui/material';
import { SaveOutlined, DeleteForever, ArrowBack } from '@mui/icons-material';
import styles from '../../../app/styles/dragging.module.css';
import { ContentItem } from '/app/interfaces';
import { MessagesContext } from '/app/context/messages';
import { MainLayout } from '/app/components/layouts';
import { validCategories } from '/app/config/constants';
import PopupRemovePost from '/app/components/home/PopupRemovePost';
import { UploadImages } from '/app/components/articles/UploadImages';
import { apiUploadImage } from '/app/utils/api/apiUtils';
import { apiCreateArticle, apiDeleteMessage, apiUpdateArticle } from '/app/utils/api/apiMessages';



interface FormData {
  _id?: string;
  title: string;
  description: string;
  mainImageId: string;
  mainImageUrl: string;
  slug: string;
  tags: string[];
  category: string;
  isValidated: boolean;
}

const PostUserPage = () => {
  const router = useRouter();
  const { slug = '' } = router.query;
  const { pageType = '' } = router.query
  const { isLoadingMessages, messagesNewsWithNotValidated, toggleUpdateMessages } = useContext(MessagesContext);
  const token = useSelector((state: any) => state.persisted.token) || {};

  const [newTagValue, setNewTagValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [openPopupRemovePost, setOpenPopupRemovePost] = useState(false);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [newText, setNewText] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");
  const [isFocusedHelpText, setisFocusedHelpText] = useState(false);

  const initalFormData = {
    _id: "",
    title: "",
    description: "",
    mainImageId: "",
    mainImageUrl: "",
    slug: "",
    tags: [],
    category: "",
  }
  const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
    defaultValues: initalFormData
  })
  const titleValue = watch('title');
  const descriptionValue = watch('description');
  const slugValue = watch('slug');

  const handleFocus = () => setisFocusedHelpText(true);
  const handleBlur = () => setisFocusedHelpText(false);

  const allowDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }

  const onDropEntry = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer.getData('text'));
    if (hoverIndex === null || draggedIndex === hoverIndex) {
      return;
    }
    const newContent = [...content];
    const item = newContent.splice(draggedIndex, 1)[0];
    newContent.splice(hoverIndex, 0, item);
    setContent(newContent);
    setIsDragging(false);
    setHoverIndex(null);
  };

  const removeContent = (index: number) => {
    const newContent = content.filter((_, idx) => idx !== index);
    setContent(newContent);
  }

  const editContent = (index: number) => {
    const item = content[index];
    if (item && item.type === 'text') {
      setNewText(item.value);
      setEditMode(true);
      setEditingIndex(index);
    }
  };

  const addOrUpdateText = (): void => {
    if (editMode && editingIndex !== null) {
      const updatedContent = content.map((item, index) => {
        if (index === editingIndex) {
          return { ...item, value: newText };
        }
        return item;
      });
      setContent(updatedContent);
      setEditMode(false);
      setEditingIndex(null);
    } else if (!editMode) {
      setContent([...content, { type: 'text', value: newText }]);
    }
    setNewText('');
  };


  const onNewTag = () => {
    const newTag = newTagValue.trim().toLocaleLowerCase();
    setNewTagValue('');
    const currentTags = getValues('tags');
    if (currentTags.includes(newTag)) {
      return;
    }
    currentTags.push(newTag);
  }

  const onDeleteTag = (tag: string) => {
    const updatedTags = getValues('tags').filter(t => t !== tag);
    setValue('tags', updatedTags, { shouldValidate: true });
  }

  const onFilesSelectedPostImages = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }
    try {
      const filesArray = Array.from(target.files);
      for (const file of filesArray) {
        const fileName = `/articleImages/${uuidv4()}`
        const { status, data } = await apiUploadImage(file, token, fileName)
        setContent(content => [...content, { type: 'image', value: data.url }]);
      }
    } catch (error) {
      console.log({ error });
    }
  };


  const onFilesSelectedMainImage = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }
    const file = target.files[0];
    try {
      const fileName = `/articleImages/${uuidv4()}`
      const { status, data } = await apiUploadImage(file, token, fileName)
      setValue('mainImageId', data.fileId, { shouldValidate: true });
      setValue('mainImageUrl', data.url, { shouldValidate: true });
    } catch (error) {
      console.log({ error });
    }
  };

  const onDeleteImage = (image: string) => {
    setValue('mainImageId', "", { shouldValidate: true });
    setValue('mainImageUrl', "", { shouldValidate: true });
  }

  const onDeletePost = async () => {
    const formData = watch();
    setIsSaving(true);

    let deletePostId = ""
    messagesNewsWithNotValidated.forEach((article) => {
      if (article.slug === slug) {
        deletePostId = article._id
      }
    })

    const { status, data } = await apiDeleteMessage(deletePostId, token)
    if (status === 200) {
      toast.success("Article deleted");
      setIsSaving(false)
      toggleUpdateMessages()
      if (pageType === "management") {
        router.push(`/user/myarticles?pageType=management`);
      } else {
        router.push(`/user/myarticles`);
      }
    } else {
      setIsSaving(false)
      toast.error("Error deleting post");
    }
  }

  const onSubmit = async (form: FormData) => {

    if (form.category.length === 0) { toast.error('It is necessary to define a category'); return }
    if (form.tags.length === 0) { toast.error('At least one label must be defined'); return }
    if (form.mainImageId.length === 0) { toast.error('A main image must be uploaded'); return }
    if (content.length === 0) { toast.error('At least one paragraph must be written'); return }
    setIsSaving(true);

    if (slug === "new") {
      const { status, data } = await apiCreateArticle({
        mainImageId: form.mainImageId,
        content: content,
        category: form.category,
        slug: form.slug,
        title: form.title,
        description: form.description,
        tags: form.tags,
        token
      });

      if (status === 201) {
        toast.success("Your article has been created and is currently pending review. Once it is published, you will receive a notification.")
        toggleUpdateMessages()
        if (pageType === "management") {
          router.push(`/user/myarticles?pageType=management`);
        } else {
          router.push(`/user/myarticles`);
        }
      } else {
        if (data.msg === "The slug is not valid, choose another one") {
          alert("Post not updated. There is already a post with the same slug, please modify it as it has to be unique. The slug is used only in the URL.")
        } else {
          alert("The article has not been updated beacuse there has been an error. Please contact the administrator.")
        }
      }
    } else {
      const { status, data } = await apiUpdateArticle({
        articleId: form._id !== undefined ? form._id : "",
        mainImageId: form.mainImageId,
        content: content,
        category: form.category,
        slug: form.slug !== originalSlug ? form.slug : undefined,
        title: form.title,
        description: form.description,
        tags: form.tags,
        token
      });
      if (status === 200) {
        toast.success("Article updated")
        toggleUpdateMessages()
        setIsSaving(false)
        if (pageType === "management") {
          router.push(`/user/myarticles?pageType=management`);
        } else {
          router.push(`/user/myarticles`);
        }
      } else {
        if (data.msg === "The slug is not valid, choose another one") {
          alert("Post not updated. There is already a post with the same slug, please modify it as it has to be unique. The slug is used only in the URL.")
        } else {
          alert("The article has not been updated beacuse there has been an error. Please contact the administrator.")
        }
      }
    }

    setIsSaving(false);
  }


  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'title') {
        let newSlug = `${value.title?.trim()}`
          .replaceAll(' ', '_')
          .replaceAll("'", '')
          .replaceAll("á", 'a').replaceAll("é", 'e').replaceAll("í", 'i').replaceAll("ó", 'o').replaceAll("ú", 'u')
          .replaceAll("ñ", 'n').replaceAll("Á", 'a').replaceAll("É", 'e').replaceAll("Í", 'i').replaceAll("Ó", 'o')
          .replaceAll("Ú", 'u').replaceAll("Ñ", 'n').replaceAll("ü", 'u').replaceAll("Ü", 'u')
          .replace(/\//g, '')
          .toLocaleLowerCase();

        newSlug = newSlug.replace(/[^a-z0-9_]/g, '');
        setValue('slug', newSlug);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);


  useEffect(() => {
    const selectedArticleAux = messagesNewsWithNotValidated.find((article) => article.slug === slug)
    if (selectedArticleAux !== undefined) {
      setValue('_id', selectedArticleAux._id, { shouldValidate: true });
      setValue('title', selectedArticleAux.articleData.title, { shouldValidate: true });
      setValue('description', selectedArticleAux.subject, { shouldValidate: true });
      setValue('mainImageId', selectedArticleAux.files[0].fileId, { shouldValidate: true });
      setValue('mainImageUrl', selectedArticleAux.files[0].url, { shouldValidate: true });
      setValue('slug', selectedArticleAux.slug, { shouldValidate: true });
      setValue('tags', selectedArticleAux.tags, { shouldValidate: true });
      setValue('category', selectedArticleAux.articleData.category, { shouldValidate: true });
      setValue('isValidated', selectedArticleAux.articleData.isValidated, { shouldValidate: true });
      setContent(selectedArticleAux.articleData.contentNews)
      setOriginalSlug(selectedArticleAux.slug)
    }
  }, [])


  return (
    <MainLayout
      title={'DeepLink user articles edit'}
      pageDescription={'DeepLink user articles edit page'}
    >
      <Box marginLeft={"100px"} padding={{ sm: "15px", md: "20px 50px" }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: 105 }}
          open={isSaving}
        >
          <Box width={"350px"} display="flex" justifyContent={"center"} flexDirection="column" alignItems="center">
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }} textAlign={"center"} fontSize={"20px"}>Creating Article...</Typography>
          </Box>
        </Backdrop>
        <Box
          margin={"20px 0"}
          padding={"20px"}
          display={"flex"}
          flexDirection={"column"}
          width={"100%"}
          maxWidth="1200px"
          height={"100%"}
          boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"}
          borderRadius={"30px"}
        >
          <form
            onKeyPress={(event) => {
              if (event.which === 13 /* Enter key */) {
                event.preventDefault();
              }
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Box display='flex' justifyContent='space-between' sx={{ mb: 2 }}>
              <Button
                color="primary"
                startIcon={<ArrowBack />}
                sx={{ mr: '20px' }}
                onClick={() => {
                  if (pageType === "management") {
                    router.push(`/user/myarticles?pageType=management`);
                  } else {
                    router.push(`/user/myarticles`);
                  }
                }}
                disabled={isSaving}
              >
                {"Back"}
              </Button>
              <Box>
                {slug !== "new" &&
                  <Button
                    color="error"
                    startIcon={<DeleteForever />}
                    sx={{ mr: '20px' }}
                    onClick={() => { setOpenPopupRemovePost(true) }}
                    disabled={isSaving}
                  >
                    {"Delete article"}
                  </Button>
                }
                <Button
                  color="primary"
                  startIcon={<SaveOutlined />}
                  // sx={{ width: '150px' }}
                  type="submit"
                  disabled={isSaving}
                  sx={{ boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)" }}
                >
                  {slug !== "new" ? "Update article" : "Create new article"}
                </Button>
              </Box>
            </Box>
            <Grid container spacing={2}>
              {/* Data */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!titleValue }}
                  sx={{ mb: 1 }}
                  {...register('title', {
                    required: 'This field is required',
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 100, message: 'Maximum 100 chars' }
                  })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!descriptionValue }}
                  multiline
                  rows={"4"}
                  sx={{ mb: 1 }}
                  {...register('description', {
                    required: 'This field is required',
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 400, message: 'Maximum 400 caracteres' }
                  })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setValue('description', getValues('description') + '\n');
                    }
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    value={getValues('category') || ''}
                    label="category"
                    sx={{ mb: 1 }}
                    onChange={({ target }) => {
                      const selectedcategory = validCategories.find((category) => category === target.value);
                      setValue('category', selectedcategory!, { shouldValidate: true })
                    }}
                  >
                    {
                      validCategories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {capitalize(category)}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
                <TextField
                  label="Tags (only one word, press space or enter to add the tag)"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 1 }}
                  // helperText="Presiona [spacebar] para agregar"
                  value={newTagValue}
                  onChange={({ target }) => {
                    const valueWithoutAccents = target.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                    setNewTagValue(valueWithoutAccents);
                    console.log('valueWithoutAccents: ', valueWithoutAccents);
                    // if (target.value === " ") {
                    //   setNewTagValue(" ");
                    // } else {
                    // }
                  }}
                  onKeyUp={({ code }) => ((code === 'Space' || code === 'Enter') && newTagValue !== "") ? onNewTag() : undefined}
                />
                <Box sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                }}
                  component="ul">
                  {
                    getValues('tags').map((tag) => {
                      return (
                        <Chip
                          key={tag}
                          label={tag}
                          onDelete={() => onDeleteTag(tag)}
                          color="primary"
                          size='small'
                          sx={{ ml: 1, mt: 1 }}
                        />
                      );
                    })}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Slug - URL (autogenerated using the title)"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!slugValue }}
                  sx={{ mb: 1 }}
                  {...register('slug', {
                    required: 'This field is required',
                    validate: (val) => val.trim().includes(' ') ? 'Cannot have spaces' : undefined
                  })}
                  error={!!errors.slug}
                  helperText={errors.slug?.message}
                />
                <UploadImages
                  onFilesSelectedMainImage={onFilesSelectedMainImage}
                  onDeleteImage={onDeleteImage}
                  getValues={getValues} />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  label={
                    !isFocusedHelpText && newText === "" ?
                      <span>
                        Write a paragraph here. Below you can see how the
                        <br />
                        paragraphs and images will be distributed.
                        <br />
                        If you want to change the order of these,
                        <br />
                        you can move them by clicking and holding down,
                        <br />
                        then drag and drop them somewhere else.
                      </span>
                      :
                      <span>Escribe un párrafo aquí.</span>
                  }
                  variant="outlined"
                  multiline={true}
                  rows={5}
                  value={newText}
                  fullWidth
                  margin="normal"
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setNewText(prev => prev + '\n');
                    }
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={2} >
                <Box height={"100%"} padding={"20px"} display={"flex"} flexDirection={"column"} justifyContent={"space-between"} alignItems={"center"}>
                  <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                    <Button color="primary" onClick={addOrUpdateText} sx={{ boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)" }}>
                      {editMode ? "Save changes" : "Add paragraph"}
                    </Button>
                    {editMode && (
                      <Button variant="contained" color={"error"} sx={{ marginTop: "10px" }} onClick={() => { setEditMode(false); setEditingIndex(null); setNewText(''); }}>
                        Cancel edition
                      </Button>
                    )}
                  </Box>
                  <input
                    accept="image/*"
                    type="file"
                    // multiple
                    onChange={onFilesSelectedPostImages}
                    style={{ display: 'none' }}
                    id="raised-button-file"
                  />
                  <label htmlFor="raised-button-file">
                    <Button color={"primary"} component="span" sx={{ boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)" }}>
                      Add image
                    </Button>
                  </label>
                </Box>
              </Grid>
            </Grid>
          </form>
          <Grid container spacing={2} padding={"10px"}>
            <Grid item xs={0} sm={1}></Grid>
            <Grid item width={"100%"} sm={12} md={10}>
              <div
                onDrop={onDropEntry}
                onDragOver={allowDrop}
                className={isDragging ? styles.dragging : ''}
              >
                <Box>
                  <List sx={{ opacity: isDragging ? 0.2 : 1, transition: 'all .3s' }}>
                    {content.map((item, index) =>
                    (
                      <Card
                        key={index}
                        data-index={index}
                        sx={{
                          marginTop: "10px",
                          padding: { xs: "10px", sm: "20px" },
                          border: editingIndex === index ? "solid green" : undefined,
                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)"
                        }}
                        draggable
                        onDragStart={(e) => {
                          setIsDragging(true);
                          e.dataTransfer.setData("text/plain", index.toString()); // Set the index as the drag data
                        }}
                        onDragEnd={() => setIsDragging(false)}
                        onDragOver={() => setHoverIndex(index)}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={9}>
                            {item.type === 'text' ?
                              item.value.split('\n').map((line, idx) => (
                                <Typography key={idx} paragraph>
                                  {line}
                                </Typography>
                              )) :
                              <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <img key={index} src={item.value} alt={`Uploaded ${index}`} style={{ maxWidth: '100%', marginTop: '10px' }} />
                              </Box>
                            }
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Box display={"flex"} width={"100%"} height={"100%"} justifyContent={"center"} alignItems={"center"} flexDirection={"row"}>
                              <Button sx={{ display: item.type === 'text' ? "flex" : "none" }} color='primary' onClick={() => editContent(index)}>Edit</Button>
                              <Button color='error' onClick={() => removeContent(index)}>Delete</Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                  </List>
                </Box>
              </div>
            </Grid>
            <Grid item xs={0} sm={1}></Grid>
          </Grid>
          <PopupRemovePost
            openPopupRemovePost={openPopupRemovePost}
            handlePopupRemovePostClose={() => { setOpenPopupRemovePost(false) }}
            onDeletePost={onDeletePost}
            text={"You are going to delete this blog forever, are you sure?"}
          />
        </Box>
      </Box>
    </MainLayout>
  )
}

export default PostUserPage