

export const supabase = {
  storage: {
    from: () => ({
      upload: jasmine.createSpy('upload').and.resolveTo({
        data: { path: 'example/path' },
        error: null
      }),
      getPublicUrl: jasmine.createSpy('getPublicUrl').and.returnValue({
        data: { publicUrl: 'http://example.com/images/example.png' }
      })
    })
  }
};
