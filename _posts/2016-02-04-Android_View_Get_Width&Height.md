---
layout: post
title:  "Android获取View的宽度和高度"
categories: Android
tags: [Android]
---
有时需要在 onCreate() 方法中获取某个 View 组件的宽度和高度，而直接调用 getWidth()、getHeight()、getMeasuredWidth()、getMeasuredHeight() 方法只会得到 0。

## 实现方案

### 1. 使用View.measure测量
该方法测量的宽度和高度可能与视图绘制完成后的真实的宽度和高度不一致。

``` java
int w = View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED);
int h = View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED);
view.measure(w, h);
view.getMeasuredWidth(); // 获取宽度
view.getMeasuredHeight(); // 获取高度
```

### 2. OnPreDrawListener监听事件
在视图将要绘制时调用该监听事件，会被调用多次，因此获取到视图的宽度和高度后要移除该监听事件。

``` java
view.getViewTreeObserver()
    .addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {

    @Override
    public boolean onPreDraw() {
        view.getViewTreeObserver().removeOnPreDrawListener(this);
        view.getWidth(); // 获取宽度
        view.getHeight(); // 获取高度
        return true;
    }
});
```

### 3. OnGlobalLayoutListener监听事件
在布局发生改变或者某个视图的可视状态发生改变时调用该事件，会被多次调用，因此需要在获取到视图的宽度和高度后执行 remove 方法移除该监听事件。

``` java
view.getViewTreeObserver()
    .addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {

        @Override
        public void onGlobalLayout() {
            if (Build.VERSION.SDK_INT >= 16) {
                view.getViewTreeObserver().removeOnGlobalLayoutListener(this);
            }
            else {
                view.getViewTreeObserver().removeGlobalOnLayoutListener(this);
            }
            view.getWidth(); // 获取宽度
            view.getHeight(); // 获取高度
        }
    });
}
```

### 4. 重写onSizeChanged方法
在视图的大小发生改变时调用该方法，会被多次调用，因此获取到宽度和高度后需要考虑禁用掉代码。
该实现方法需要继承 View，且多次被调用，**不建议使用**。

``` java
@Override
protected void onSizeChanged(int w, int h, int oldw, int oldh) {
    super.onSizeChanged(w, h, oldw, oldh);
    view.getWidth(); // 获取宽度
    view.getHeight(); // 获取高度
}
```

### 5. 重写onLayout方法
该方法会被多次调用，获取到宽度和高度后需要考虑禁用掉代码。
该实现方法需要继承 View，且多次被调用，**不建议使用**。

``` java
@Override
protected void onLayout(boolean changed, int l, int t, int r, int b) {
    super.onLayout(changed, l, t, r, b);
    view.getWidth(); // 获取宽度
    view.getHeight(); // 获取高度
}
```

### 6. OnLayoutChangeListener监听事件
在视图的 layout 改变时调用该事件，会被多次调用，因此需要在获取到视图的宽度和高度后执行 remove 方法移除该监听事件。
**API Level >= 11**

``` java
view.addOnLayoutChangeListener(new View.OnLayoutChangeListener() {

    @Override
    public void onLayoutChange(View v, int left, int top, int right, int bottom,
            int oldLeft, int oldTop, int oldRight, int oldBottom) {
        view.removeOnLayoutChangeListener(this);
        view.getWidth(); // 获取宽度
        view.getHeight(); // 获取高度
     }
});
```

### 7. 使用View.post方法
Runnable 对象中的方法会在 View 的 measure、layout 等事件完成后触发。
UI 事件队列会按顺序处理事件，在 setContentView() 被调用后，事件队列中会包含一个要求重新 layout 的 message，所以任何 post 到队列中的 Runnable 对象都会在 Layout 发生变化后执行。
该方法只会执行一次，且逻辑简单，**建议使用**。

``` java
view.post(new Runnable() {

    @Override
    public void run() {
        view.getWidth(); // 获取宽度
        view.getHeight(); // 获取高度
    }
});
```

---

## 参考资料

### [stackoverflow: getWidth() and getHeight() of View returns 0](https://stackoverflow.com/questions/3591784/getwidth-and-getheight-of-view-returns-0/24035591#24035591)

## 源码地址

### [GitHub: MeasureViewDemo](https://github.com/wuzhendev/samples/tree/master/MeasureViewDemo)
